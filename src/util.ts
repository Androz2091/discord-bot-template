import { EmbedBuilder } from "discord.js";

export const errorEmbed = (message: string) => {
	return {
		embeds: [new EmbedBuilder().setDescription(`❌ | ${message}`).setColor(process.env.EMBED_COLOR)],
	};
};

export const successEmbed = (message: string) => {
	return {
		embeds: [new EmbedBuilder().setDescription(`✅ | ${message}`).setColor(process.env.EMBED_COLOR)],
	};
};

export const replyEmbed = (message: string) => {
	return {
		embeds: [new EmbedBuilder().setDescription(message).setColor(process.env.EMBED_COLOR)],
	};
};

export const generateId = () => {
	return Math.random().toString(36).slice(2, 12);
};

export const generateEmbeds = <T>(
	{
		entries,
		generateEmbed,
		generateEntry,
	}: {
		entries: T[];
		generateEmbed: (idx: number) => EmbedBuilder;
		generateEntry: (entry: T) => string;
	},
	threshold = 2050,
) => {
	const embeds: EmbedBuilder[] = [];
	entries.forEach((entry) => {
		const entryContent = generateEntry(entry);
		// biome-ignore lint: embeds is going to be filled
		const lastEmbedTooLong = !embeds.length || embeds.at(-1)!.data.description!.length + entryContent.length >= threshold;
		if (lastEmbedTooLong) {
			const newEmbed = generateEmbed(embeds.length);
			embeds.push(newEmbed);
		}
		// biome-ignore lint: embeds is going to be filled
		const lastEmbed = embeds.at(-1)!;
		lastEmbed.data.description = (lastEmbed.data.description || "") + entryContent;
	});
	return embeds;
};
