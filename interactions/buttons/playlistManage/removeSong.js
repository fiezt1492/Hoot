const {
	EmbedBuilder,
	ActionRowBuilder,
	Modal,
	TextInputBuilder,
} = require("discord.js");

module.exports = {
	id: "pldelsong",

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
	},
};
