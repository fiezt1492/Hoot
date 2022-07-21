const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "disconnect",
	async execute(queue, client) {
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
