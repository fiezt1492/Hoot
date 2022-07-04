const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "playSong",
	execute(queue, song, client, status) {
		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle(song.name)
			.setURL(song.url)
			.setDescription(
				`Duration: ${song.formattedDuration}\nRequested by: ${song.user}`
			)
			.setThumbnail(song.thumbnail)
			.setFooter({
				text: `${status(queue)}`,
			});

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
