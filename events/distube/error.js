const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "error",
	execute(channel, e, client) {
		const Embed = new EmbedBuilder()
			.setColor("Red")
			.setTitle(`ERROR`)
			.setDescription(
				`An error encountered: \`\`\`${e.toString().slice(0, 1974)}\`\`\``
			);

		if (channel)
			channel.send({
				embeds: [Embed],
			});
		else console.error(e);
	},
};
