const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "empty",
	execute(queue, client, status) {
		const Embed = new MessageEmbed()
			.setColor("RED")
			.setTitle(`ERROR`)
			.setDescription("Voice channel is empty! Leaving the channel...");

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
