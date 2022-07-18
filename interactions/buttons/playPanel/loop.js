module.exports = {
	id: "loop",

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

		let mode = queue.repeatMode + 1;
		if (mode >= 3) mode = 0;
		queue.setRepeatMode(mode);
		client.emit("updatePanel", interaction, queue);
		return;
	},
};
