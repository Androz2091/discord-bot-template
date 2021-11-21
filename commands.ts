import { APIApplicationCommand } from "discord-api-types";
import { Client, ApplicationCommand, ApplicationCommandData, CommandInteraction, Message } from "discord.js";
import { Collection } from '@discordjs/collection';
import { readdirSync } from "fs";

interface SynchronizeSlashCommandOptions {
    guildId?: null|string;
    debug?: boolean;
}

export const synchronizeSlashCommands = async (client: Client, commands: APIApplicationCommand[], options: SynchronizeSlashCommandOptions = {}) => {

    const log = (message: string) => options.debug && console.log(message);

    const ready = client.readyAt ? Promise.resolve() : new Promise(resolve => client.once('ready', resolve));
    await ready;
    const currentCommands = options.guildId ? await client.application!.commands.fetch({
        guildId: options.guildId,
    }) : await client.application!.commands.fetch();

    log(`Synchronizing commands...`);
    log(`Currently ${currentCommands.size} commands.`);

    const newCommands = commands.filter((command) => !currentCommands.some((c) => c.name === command.name));
    for (let newCommand of newCommands) {
        if (options.guildId) await client.application!.commands.create(newCommand, options.guildId);
        else await client.application!.commands.create(newCommand);
    }

    log(`Created ${newCommands.length} commands!`);

    const deletedCommands = currentCommands.filter((command) => !commands.some((c) => c.name === command.name)).toJSON();
    for (let deletedCommand of deletedCommands) {
        await deletedCommand.delete();
    }

    log(`Deleted ${deletedCommands.length} commands!`);

    const updatedCommands = commands.filter((command) => currentCommands.some((c) => c.name === command.name));
    let updatedCommandCount = 0;
    for (let updatedCommand of updatedCommands) {
        const newCommand = updatedCommand;
        const previousCommand = currentCommands.find((c) => c.name === updatedCommand.name);
        let modified = false;
        if (previousCommand!.description !== newCommand.description) modified = true;
        if (!ApplicationCommand.optionsEqual(previousCommand!.options ?? [], newCommand.options ?? [])) modified = true;
        if (modified) {
            await previousCommand!.edit(newCommand as unknown as ApplicationCommandData);
            updatedCommandCount++;
        }
    }

    log(`Updated ${updatedCommandCount} commands!`);

    log(`Commands synchronized!`);

    return {
        currentCommandCount: currentCommands.size,
        newCommandCount: newCommands.length,
        deletedCommandCount: deletedCommands.length,
        updatedCommandCount
    };

};

interface SlashCommandRunFunction {
    (interaction: CommandInteraction, commandName: string): void;
}

interface MessageCommandRunFunction {
    (message: Message, commandName: string): void;
}

export const loadSlashCommands = (client: Client) => {
    const commands = new Collection<string, SlashCommandRunFunction>();
    const commandsData: APIApplicationCommand[] = [];
    
    try {
        readdirSync(`${__dirname}/slash-commands`).forEach(file => {
            if (file.endsWith('.js')) {
                const command = require(`${__dirname}/slash-commands/${file}`);
                if (!command.commands) return console.log(`${file} has no commands`);
                commandsData.push(...command.commands);
                command.commands.forEach((commandData: APIApplicationCommand) => {
                    commands.set(commandData.name, command.run);
                    console.log(`Loaded slash command ${commandData.name}`);
                });
            }
        });
    } catch {
        console.log(`No slash commands found`);
    }

    synchronizeSlashCommands(client, commandsData, {
        debug: true,
        guildId: process.env.GUILD_ID
    });

    return commands;
}

export const loadMessageCommands = (client: Client) => {
    const commands = new Collection<string, MessageCommandRunFunction>();
    
    try {
        readdirSync(`${__dirname}/commands`).forEach(file => {
            if (file.endsWith('.js')) {
                const command = require(`${__dirname}/commands/${file}`);
                if (!command.commands) return console.log(`${file} has no commands`);
                command.commands.forEach((commandName: string) => {
                    commands.set(commandName, command.run);
                    console.log(`Loaded message command ${commandName}`);
                });
            }
        });
    } catch {
        console.log(`No message commands found`);
    }

    return commands;
};
