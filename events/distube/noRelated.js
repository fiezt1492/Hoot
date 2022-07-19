const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "noRelated",
	execute(queue, client, status) {
		const Embed = new EmbedBuilder()
			.setColor("RED")
			.setDescription("Can't find related video to play.");

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
