const { MessageEmbed } = require("discord.js");

module.exports = (songs, name) => [
	new MessageEmbed()
		.setColor(name === "Favorite" ? "RED" : "RANDOM")
		.setTitle(`${name}`)
		.setDescription(`${songs.length ? `${songs.length}/100 songs` : "Empty"}`),
];
/**
 * const color = name === "Favorite" ? "RED" : "RANDOM";

	if (!songs.length)
		return [
			new MessageEmbed()
				.setColor(color)
				.setTitle(name)
				.setDescription("`Empty`")
				.setFooter({
					text: `${songs.length} songs`,
				}),
		];

	const tempSongs = [...songs];

	const playlist = await distube.createCustomPlaylist(tempSongs, {
		properties: { name: `${name}` },
		parallel: true,
	});

	const playlistSongs = playlist.map(
		(song, i) =>
			`${`\`${i + 1}\`. [${song.name}](${song.url}) - \`${
				song.formattedDuration
			}\``}`
	);

	const splittedPlaylistSongs = _.chunk(playlistSongs, 10);

	const pages = splittedPlaylistSongs.map((c) =>
		new MessageEmbed()
			.setTitle(`${playlist.name}`)
			.setDescription(`${c.join("\n")}`)
			.setColor(color)
	);

	return [pages];
 */
