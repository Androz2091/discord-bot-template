import { Client, ApplicationCommand, ApplicationCommandData, CommandInteraction, Message, ChatInputApplicationCommandData, ContextMenuInteraction } from "discord.js";
import { Collection } from '@discordjs/collection';
import { readdirSync } from "fs";
import { join } from "path";
import { CronJob } from "cron";

interface SynchronizeSlashCommandOptions {
    guildId?: null|string;
    debug?: boolean;
}

export const synchronizeSlashCommands = async (client: Client, commands: ChatInputApplicationCommandData[], options: SynchronizeSlashCommandOptions = {}) => {

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
        if (previousCommand?.description !== newCommand?.description) modified = true;
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

export interface TaskData {
    name: string;
    crons: string;
    jobs: CronJob[];
    run(): void;
}

export const loadTasks = (client: Client) => {
    const tasks = new Collection<string, TaskData>();
    const tasksData: TaskData[] = [];

    try {
        readdirSync(join(__dirname, '..', 'tasks')).forEach(file => {
            if (file.endsWith('.js')) {
                const task = require(join(__dirname, '..', 'tasks', file));
                if (!task.crons) return console.log(`${file} has no task`);

                task.jobs = [];
                task.crons.forEach((cron: string) => {
                    task.jobs.push(new CronJob(cron, () => {
                        task.run();
                    }, null, true, 'America/Los_Angeles'));
                });

                tasks.set(task.name, task);
                tasksData.push(task);
                console.log(`Loaded task ${task.name}`);
            }
        });
    } catch {
        console.log(`No task found`);
    }

    return {
        tasks,
        tasksData
    };
}
