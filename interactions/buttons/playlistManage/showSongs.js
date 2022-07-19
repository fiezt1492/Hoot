const _ = require("lodash");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
	id: "plshow",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		const name = message.embeds[0].title;

		const exist = await client.db.models.Playlists.findOne({
			where: {
				playlistOwnerId: interaction.user.id,
				playlistId: `${name}`,
			},
		});

		if (exist === null)
			return interaction.reply({
				content: `${client.emotes.error} | This playlist doesn't exist!`,
				ephemeral: true,
			});

		if (!exist.dataValues.data.songs.length)
			return interaction.reply({
				content: `${client.emotes.error} | This playlist doesn't have any song!`,
				ephemeral: true,
			});

		const playlist = await client.distube.createCustomPlaylist(
			exist.dataValues.data.songs,
			{
				member: interaction.member,
				properties: { name: `${exist.dataValues.playlistId}` },
				parallel: true,
			}
		);

		const songs = playlist.songs.map(
			(song, i) =>
				`${`\`${i + 1}\`. [${song.name}](${song.url}) - \`${
					song.formattedDuration
				}\``}`
		);

		const splittedSongs = _.chunk(songs, 10);

		const pages = splittedSongs.map((c) =>
			new EmbedBuilder()
				.setTitle(`${exist.dataValues.playlistId}'s songs`)
				.setDescription(`${c.join("\n")}`)
				.setColor("Random")
		);

		if (pages.length < 2)
			return interaction.reply({
				embeds: pages,
				ephemeral: true,
			});
		else {
			const filter = (i) => i.user.id == interaction.user.id;
			client.util.page(
				interaction,
				pages,
				60000,
				true,
				filter,
				false,
				[],
				true
			);
		}
	},
};
