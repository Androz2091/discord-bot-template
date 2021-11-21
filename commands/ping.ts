import { Message } from "discord.js";

export const commands = [
    'ping'
];

export const run = async (message: Message) => {

    message.channel.send(`🏓 Pong! My latency is currently \`${message.client.ws.ping}ms\`.`);
    
}
