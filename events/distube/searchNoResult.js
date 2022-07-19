const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "searchNoResult",
	execute(message, query, client, status) {
		const Embed = new EmbedBuilder()
			.setColor("RED")
			.setTitle(`ERROR`)
			.setDescription(`No result found for \`${query}\`!`);
			
		message.channel.send({
			embeds: [Embed],
		});
	},
};
