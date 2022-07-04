const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "empty",
	execute(channel, client, status) {
		channel.send({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setDescription("Voice channel is empty! Leaving the channel..."),
			],
		});
	},
};
