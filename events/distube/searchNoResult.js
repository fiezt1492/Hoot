const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "searchNoResult",
	execute(message, query, client) {
		const Embed = new EmbedBuilder()
			.setColor("Red")
			.setTitle(`ERROR`)
			.setDescription(`No result found for \`${query}\`!`);
			
		message.channel.send({
			embeds: [Embed],
		});
	},
};
