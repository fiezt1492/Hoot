const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addList",
	execute(queue, playlist, client, status) {
		queue.textChannel.send({
			embeds: [
				new MessageEmbed()
					.setColor("RANDOM")
					.setDescription(
						`Added [\`${playlist.name}\`](${playlist.url}) playlist (\`${playlist.songs.length}\` songs) to queue`
					)
					.setFooter({ text: `${status(queue)}` }),
			],
		});
	},
};
