const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "error",
	execute(channel, e, client, status) {
		if (channel)
			channel.send({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setTitle("An error encountered")
						.setAuthor({
							name: `ERROR`,
						})
						.setDescription(`${e.toString().slice(0, 1974)}`),
				],
			});
		else console.error(e);
	},
};
