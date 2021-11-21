import { CommandInteraction } from "discord.js";

export const commands = [
    {
        name: "ping",
        description: "Get the bot's latency"
    }
];

export const run = async (interaction: CommandInteraction) => {

    interaction.reply(`🏓 Pong! My latency is currently \`${interaction.client.ws.ping}ms\`.`);
    
}
