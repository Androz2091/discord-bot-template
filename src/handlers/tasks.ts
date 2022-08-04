import { Client, ApplicationCommand, ApplicationCommandData, ChatInputApplicationCommandData } from "discord.js";
import { Collection } from '@discordjs/collection';
import { readdirSync } from "fs";
import { join } from "path";
import { CronJob } from "cron";

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
