const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addSong",
	execute(queue, song, client, status) {
		const Embed = new MessageEmbed()
			.setColor("RED")
			.setTitle(`ERROR`)
			.setDescription(
				`Added **[${song.name}](${song.url})** - \`${
					song.formattedDuration
				}\` to the queue at position \`${queue.songs.length - 1}\``
			)
			.setAuthor({
				name: `${song.user.tag}`,
				iconURL: `${song.user.displayAvatarURL()}`,
			});

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
