const { EmbedBuilder } = require("discord.js");

module.exports = {
	id: "shuffle",

	async execute(interaction) {
		const { client, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		if (
			!queue.starter ||
			queue.starter.id !== interaction.user.id ||
			!queue.panelId ||
			interaction.message.id !== queue.panelId
		)
			return interaction.reply({
				content: `${client.emotes.error} | You don't own this panel!`,
				ephemeral: true,
			});

		queue.shuffle();

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Blurple")
					.setAuthor({
						name: `${interaction.user.tag}`,
						iconURL: `${interaction.user.displayAvatarURL()}`,
					})
					.setTitle("Shuffled songs in queue!"),
			],
		});
		return;
	},
};
