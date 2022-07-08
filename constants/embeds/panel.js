const { MessageEmbed } = require("discord.js");

module.exports = (song, queue, client) => [
	new MessageEmbed()
		.setColor(queue.paused ? "RED" : "RANDOM")
		.setAuthor({
			name: `${song.user.tag}`,
			iconURL: `${song.user.displayAvatarURL()}`,
		})
		.setTitle(song.name)
		.setURL(song.url)
		.setThumbnail(song.thumbnail)
		.setFooter({
			text: `${song.formattedDuration} | ${client.status(queue)}`,
		}),
];
