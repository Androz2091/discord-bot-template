import { config } from 'dotenv';
config();

import { initialize as initializeDatabase } from './database';
import { loadContextMenus, loadMessageCommands, loadSlashCommands, synchronizeSlashCommands } from './commands';

import { syncSheets } from './sheets';

import { Client, Intents } from 'discord.js';
import { errorEmbed } from './util';
export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const { slashCommands, slashCommandsData } = loadSlashCommands(client);
const { contextMenus, contextMenusData } = loadContextMenus(client);
const messageCommands = loadMessageCommands(client);

synchronizeSlashCommands(client, [...slashCommandsData, ...contextMenusData], {
    debug: true,
    guildId: process.env.GUILD_ID
});

client.on('interactionCreate', async (interaction) => {

    if (interaction.isCommand()) {
        const run = slashCommands.get(interaction.commandName);
        if (!run) return void interaction.reply(errorEmbed('Unknown command'));
        run(interaction, interaction.commandName);
    }

    else if (interaction.isContextMenu()) {
        const run = contextMenus.get(interaction.commandName);
        if (!run) return void interaction.reply(errorEmbed('Unknown context menu'));
        run(interaction, interaction.commandName);
    }

});

client.on('messageCreate', (message) => {

    if (message.author.bot) return;

    if (!process.env.COMMAND_PREFIX) return;
    
    const args = message.content.slice(process.env.COMMAND_PREFIX.length).split(/ +/);
    const commandName = args.shift();

    if (!commandName) return;

    const run = messageCommands.get(commandName);
    
    if (!run) return;

    run(message, commandName);

});

client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}. Ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers 🚀`);

    if (process.env.DB_NAME) {
        initializeDatabase().then(() => {
            console.log('Database initialized 📦');
        });
    } else {
        console.log('Database not initialized, as no keys were specified 📦');
    }

    if (process.env.SPREADSHEET_ID) {
        syncSheets();
    }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
