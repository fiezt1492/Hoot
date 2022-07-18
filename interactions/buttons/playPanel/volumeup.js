module.exports = {
	id: "volumeup",

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

		if (queue.volume >= 100)
			return interaction.reply({
				content: `${client.emotes.error} | Cannot up volume anymore!`,
				ephemeral: true,
			});

		queue.setVolume(queue.volume + 10);

		client.emit("updatePanel", interaction, queue);
		return;
	},
};
