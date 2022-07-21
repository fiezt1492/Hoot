const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "empty",
	async execute(queue, client) {
		const Embed = new EmbedBuilder()
			.setColor("Red")
			.setDescription("Voice channel is empty! Leaving the channel...");

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
