const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
	name: "updatePanel",
	async execute(interaction, queue) {
		const { client, guild } = interaction;

		const Embed = require("../../constants/embeds/playPanel")(
			queue.songs[0],
			queue,
			client
		);

		const components = require("../../constants/components/playPanel")(
			false,
			queue,
			client
		);

		await interaction.update({
			embeds: Embed,
			components: components,
		});
	},
};
