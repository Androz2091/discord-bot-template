import { EmbedBuilder } from "discord.js";

export const errorEmbed = (message: string) => {
    return {
        embeds: [
            new EmbedBuilder()
                .setDescription(`❌ | ${message}`)
                .setColor(process.env.EMBED_COLOR)
        ]
    }
}

export const successEmbed = (message: string) => {
    return {
        embeds: [
            new EmbedBuilder()
                .setDescription(`✅ | ${message}`)
                .setColor(process.env.EMBED_COLOR)
        ]
    }
}

export const replyEmbed = (message: string) => {
    return {
        embeds: [
            new EmbedBuilder()
                .setDescription(message)
                .setColor(process.env.EMBED_COLOR)
        ]
    }
}
