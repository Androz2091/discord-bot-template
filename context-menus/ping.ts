import { ContextMenuInteraction } from "discord.js";
import { ContextMenuRunFunction } from "../commands";

export const contextMenus = [
    {
        name: "Ping",
        type: 3
    }
];

export const run: ContextMenuRunFunction = async (interaction: ContextMenuInteraction) => {

    interaction.reply(`🏓 Pong! My latency is currently \`${interaction.client.ws.ping}ms\`.`);

}
