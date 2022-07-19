const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "error",
	execute(channel, e, client, status) {
		const Embed = new EmbedBuilder()
			.setColor("RED")
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
