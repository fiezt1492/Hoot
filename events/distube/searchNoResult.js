const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "searchNoResult",
	execute(message, query, client, status) {
        message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
	},
};
