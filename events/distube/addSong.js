const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "addSong",
	async execute(queue, song, client) {
		if (queue.songs.length - 1 > client.maxSongs) {
			queue.songs.splice(client.maxSongs + 1).length;
			return queue.textChannel.send({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setTitle("FAILED TO ADD SONG")
						.setDescription(
							`Cannot add [\`${song.name}\`](${song.url}) to queue as your queue length meets limitation (\`${client.maxSongs}\`).`
						),
				],
			});
		}

		const Embed = new EmbedBuilder()
			.setColor("Random")
			.setDescription(
				`Added **[${song.name}](${song.url})** - \`${
					song.formattedDuration
				}\` to the queue${
					queue.songs.length <= 1
						? ""
						: ` at position \`${queue.songs.findIndex((s) => s === song)}\``
				}`
			);
		// .setAuthor({
		// 	name: `${song.user.tag}`,
		// 	iconURL: `${song.user.displayAvatarURL()}`,
		// });

		await song.metadata.i.editReply({
			embeds: [Embed],
		});
	},
};
