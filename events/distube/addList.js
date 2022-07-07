const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addList",
	execute(queue, playlist, client, status) {
		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`Added [\`${playlist.name}\`](${playlist.url}) playlist (\`${
					playlist.songs.length
				}\` songs) to queue for total \`${
					queue.songs.length - 1
				}\` songs in queue`
			)
			.setAuthor({
				name: `${playlist.user.tag}`,
				iconURL: `${playlist.user.displayAvatarURL()}`,
			});

		queue.textChannel.send({
			embeds: [Embed],
		});
	},
};
