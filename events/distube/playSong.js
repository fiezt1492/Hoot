const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "playSong",
	execute(queue, song, client, status) {
		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: `${song.user.tag}`,
				iconURL: `${song.user.displayAvatarURL()}`,
			})
			.setTitle(song.name)
			.setURL(song.url)
			.setThumbnail(song.thumbnail)
			.setFooter({
				text: `${song.formattedDuration} | ${status(queue)}`,
			});

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
