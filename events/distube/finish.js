const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "finish",
	async execute(queue, client) {
		const Embed = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"This is the end of queue. Add more with `play` command."
			);

			try {
				const oldPanel = await queue.textChannel.messages.fetch(queue.panelId);
				if (oldPanel && oldPanel.editable)
					oldPanel.edit({
						embeds: [Embed],
						components: [],
					});
			} catch (error) {
				queue.textChannel.send({
					embeds: [Embed],
				});
			}
	},
};
