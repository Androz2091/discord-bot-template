import { config } from 'dotenv';
config();

import { Client, Intents } from 'discord.js';
import { initialize } from './database';
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}. Ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers 🚀`);

    initialize().then(() => {
        console.log('Database initialized 📦');
    });
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
