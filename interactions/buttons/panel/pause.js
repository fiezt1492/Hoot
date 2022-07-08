// const { MessageEmbed } = require("discord.js");

module.exports = {
	id: "pause",

	async execute(interaction) {
		const { client, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		if (!queue.starter || queue.starter.id !== interaction.user.id)
			return interaction.reply({
				content: `${client.emotes.error} | You don't own this panel!`,
				ephemeral: true,
			});

		// console.log(queue);

		if (queue.paused) {
			queue.resume();
		} else {
			queue.pause();
		}

		client.emit("updatePanel", interaction, queue);
	},
};
