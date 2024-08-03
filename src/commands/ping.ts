import { MessageCommandRunFunction } from "../handlers/commands.js";

export const commands = [
    'ping'
];

export const run: MessageCommandRunFunction = async (message) => {

    message.channel.send(`🏓 Pong! My latency is currently \`${message.client.ws.ping}ms\`.`);
    
}
