const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "searchNoResult",
	execute(message, query, client, status) {
		const Embed = new MessageEmbed()
			.setColor("RED")
			.setTitle(`ERROR`)
			.setDescription(`No result found for \`${query}\`!`);
			
		message.channel.sendd({
			embeds: [Embed],
		});
	},
};
