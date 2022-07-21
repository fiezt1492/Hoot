// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const pageModule = require("../../../modules/util/page");
const { SlashCommandBuilder } = require("@discordjs/builders");
const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Search lyrics of a song")
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription("Song name/related string to search")
		)
		.addBooleanOption((option) =>
			option
				.setName("ephemeral")
				.setDescription(
					"Whether to show the lyrics ephemeral or not | Default: false"
				)
		),
	// inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;
		let song = interaction.options.getString("song");
		const queue = client.distube.getQueue(guild);

		if (!song && !queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const ephemeral = interaction.options.getBoolean("ephemeral") || false;

		await interaction.deferReply({ ephemeral: ephemeral });

		song = song || queue.songs[0].name;

		song = song.replace(
			/lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
			""
		);

		// console.log(song);

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
