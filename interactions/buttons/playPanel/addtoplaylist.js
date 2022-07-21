const {
	EmbedBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
} = require("discord.js");

module.exports = {
	id: "addtopl",

	async execute(interaction) {
		const { client, guild, message } = interaction;

		let song = {
			name: message.embeds[0].title,
			url: message.embeds[0].url,
		};

		const userPlaylistsModels = await client.db.models.Playlists.findAll({
			where: {
				playlistOwnerId: interaction.user.id,
			},
		});

		if (!userPlaylistsModels.length)
			return interaction.reply({
				content: `${client.emotes.error} | You have no playlist! Create one by using \`/playlist create\``,
				ephemeral: true,
			});

		const userPlaylistOpitons = userPlaylistsModels.map((model) => ({
			label: `${model.dataValues.playlistId}`,
			description: `${model.dataValues.data.songs.length} songs`,
			value: `${model.dataValues.playlistId}`,
		}));

		const Embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle(song.name)
			.setURL(song.url)
			.setDescription(
				`Which playlist you want to add [\`${song.name}\`](${song.url}) to?`
			);

		const row = (state) =>
			new ActionRowBuilder().addComponents(
				new SelectMenuBuilder()
					.setCustomId("addtopl")
					.setPlaceholder("Select a playlist...")
					.setDisabled(state)
					.addOptions(userPlaylistOpitons)
			);

		await interaction.reply({
			embeds: [Embed],
			components: [row(false)],
			ephemeral: true,
		});

		return;
	},
};
