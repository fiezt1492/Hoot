const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");
const { EmbedBuilder } = require("discord.js");
const pageModule = require("../../../modules/util/page");

module.exports = {
	id: "lyrics",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		await interaction.deferReply({ ephemeral: true });

		let song = message.embeds[0].title;
		let lyrics = await lyricsFinder(song);

		if (!lyrics)
			return interaction.editReply({
				content: `${client.emotes.error} | No lyrics found for \`${song}\`!`,
				ephemeral: true,
			});

		lyrics = lyrics.split("\n");
		let splitedLyrics = _.chunk(lyrics, 40);

		let pages = splitedLyrics.map((ly) =>
			new EmbedBuilder()
				.setTitle(`Lyrics for: ${song}`)
				.setColor("Random")
				.setDescription(ly.join("\n"))
		);

		if (!pages.length)
			return interaction.editReply({
				content: `${client.emotes.error} | No lyrics found for \`${song}\`!`,
				ephemeral: true,
			});

		if (pages.length < 2)
			return interaction.editReply({
				embeds: pages,
			});
		else {
			const filter = (i) => i.user.id == interaction.user.id;
			pageModule(interaction, pages, 60000, true, filter, true);
		}
	},
};
