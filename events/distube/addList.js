const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "addList",
	execute(queue, playlist, client, status) {
		let playlistLength = playlist.songs.length;

		if (queue.songs.length - 1 > client.maxSongs) {
			const exceptLength = queue.songs.splice(client.maxSongs + 1).length;
			queue.textChannel.send({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription(
							`Your queue length meets limitation (\`${client.maxSongs}\`), some of your songs (\`${exceptLength}\` songs) were removed.`
						),
				],
			});
			playlistLength -= exceptLength;
		}

		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`Added [\`${playlist.name}\`](${
					playlist.url
				}) playlist (\`${playlistLength}\` songs) to queue for total \`${
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
