const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "disconnect",
	async execute(queue, client, status) {
		// const Embed = new EmbedBuilder()
		// 	.setColor("RED")
		// 	.setTitle(`ERROR`)
		// 	.setDescription("Voice channel is empty! Leaving the channel...");

		// queue.textChannel.send({
		// 	embeds: [Embed],
		// });
		try {
			if (queue.panelId) {
				const oldPanel = await queue.textChannel.messages.fetch(queue.panelId);
				if (oldPanel && oldPanel.deletable) oldPanel.delete();
			}
		} catch (error) {
			console.error(error);
		}
		
		// console.log(queue);
	},
};
