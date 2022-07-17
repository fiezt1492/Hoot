const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "playSong",
	async execute(queue, song, client, status) {
		const Embed = require("../../constants/embeds/playPanel")(
			song,
			queue,
			client
		);

		const components = require("../../constants/components/playPanel")(
			false,
			queue,
			client
		);

		if (queue.panelId) {
			const oldPanel = await queue.textChannel.messages.fetch(queue.panelId);
			if (oldPanel && oldPanel.deletable) oldPanel.delete();
		}

		const msg = await queue.textChannel.send({
			embeds: Embed,
			components: components,
		});

		queue.panelId = msg.id;
	},
};
