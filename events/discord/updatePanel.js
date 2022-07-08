const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "updatePanel",
	async execute(interaction, queue) {
		const { client, guild } = interaction;

		const Embed = require("../../constants/embeds/panel")(
			queue.songs[0],
			queue,
			client
		);

		const components = require("../../constants/components/panel")(
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
