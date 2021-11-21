import { config } from 'dotenv';
config();

import { initialize as initializeDatabase } from './database';
import { loadMessageCommands, loadSlashCommands } from './commands';

import { Client, Intents } from 'discord.js';
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const slashCommands = loadSlashCommands(client);
const messageCommands = loadMessageCommands(client);

client.on('interactionCreate', (interaction) => {

    if (!interaction.isCommand()) return;

    const run = slashCommands.get(interaction.commandName);

    if (!run) {
        interaction.reply('Unknown command');
        return;
    }

    run(interaction, interaction.commandName);

});

client.on('messageCreate', (message) => {

    if (message.author.bot) return;
    
    const args = message.content.slice(process.env.COMMAND_PREFIX.length).split(/ +/);
    const commandName = args.shift();

    if (!commandName) return;

    const run = messageCommands.get(commandName);
    
    if (!run) return;

    run(message, commandName);

});

client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}. Ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers 🚀`);

    initializeDatabase().then(() => {
        console.log('Database initialized 📦');
    });
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
