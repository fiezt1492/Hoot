const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "noRelated",
	execute(queue, client) {
		const Embed = new EmbedBuilder()
			.setColor("Red")
			.setDescription("Can't find related video to play.");

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
