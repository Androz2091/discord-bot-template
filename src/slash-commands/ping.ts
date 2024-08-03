import { CommandInteraction } from "discord.js";
import { SlashCommandRunFunction } from "../handlers/commands.js";

export const commands = [
    {
        name: "ping",
        description: "Get the bot's latency"
    }
];

export const run: SlashCommandRunFunction = async (interaction) => {

    interaction.reply(`🏓 Pong! My latency is currently \`${interaction.client.ws.ping}ms\`.`);

}
