const { EmbedBuilder } = require("discord.js");

module.exports = (song, queue, client) => [
	new EmbedBuilder()
		.setColor(queue.paused ? "Red" : "Random")
		.setAuthor({
			name: `${queue.starter.user.tag}`,
			iconURL: `${queue.starter.user.displayAvatarURL()}`,
		})
		.setTitle(song.name)
		.setURL(song.url)
		.setThumbnail(song.thumbnail)
		.setFooter({
			text: `${song.formattedDuration} | ${client.status(queue)} | ${
				song.user.tag
			}`,
		}),
];
