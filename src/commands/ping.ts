import { ChannelType } from "discord.js";
import type { MessageCommandRunFunction } from "../handlers/commands.js";

export const commands = ["ping"];

export const run: MessageCommandRunFunction = async (message) => {
	if (message.channel.type === ChannelType.GuildText) {
		message.channel.send(`🏓 Pong! My latency is currently \`${message.client.ws.ping}ms\`.`);
	}
};
