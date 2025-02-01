import { MessageCommandRunFunction } from "../handlers/commands.js";
import { ChannelType } from "discord.js";

export const commands = [
    'ping'
];

export const run: MessageCommandRunFunction = async (message) => {

    if (message.channel.type == ChannelType.GuildText) {
        message.channel.send(`🏓 Pong! My latency is currently \`${message.client.ws.ping}ms\`.`);
    }

}
