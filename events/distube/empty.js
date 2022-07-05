const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "empty",
	execute(queue, client, status) {
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setDescription("Voice channel is empty! Leaving the channel..."),
			],
		});
	},
};
