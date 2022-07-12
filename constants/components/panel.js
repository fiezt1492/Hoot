const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = (state, queue, client) => [
	new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("pause")
			.setDisabled(state)
			.setEmoji(client.emotes.playorpause)
			.setStyle(queue.paused ? "DANGER" : "SECONDARY"),
		new MessageButton()
			.setCustomId("next-track")
			.setDisabled(state)
			.setEmoji(client.emotes.next)
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("volumeup")
			.setDisabled(queue.volume >= 100 ? true : state)
			.setEmoji(client.emotes.volume.high)
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("shuffle")
			.setDisabled(state)
			.setEmoji(client.emotes.shuffle)
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("favorite")
			.setDisabled(true)
			.setEmoji(client.emotes.favorite)
			.setStyle("SECONDARY")
	),
	new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("autoplay")
			.setDisabled(state)
			.setEmoji(client.emotes.play)
			.setStyle(queue.autoplay ? "SUCCESS" : "DANGER"),
		new MessageButton()
			.setCustomId("pre-track")
			.setDisabled(state)
			.setEmoji(client.emotes.previous)
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("volumedown")
			.setDisabled(queue.volume <= 0 ? true : state)
			.setEmoji(client.emotes.volume.medium)
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("loop")
			.setDisabled(state)
			.setEmoji(
				queue.repeatMode
					? queue.repeatMode === 2
						? client.emotes.loop.queue
						: client.emotes.loop.song
					: client.emotes.loop.queue
			)
			.setStyle(queue.repeatMode ? "SECONDARY" : "DANGER"),
		new MessageButton()
			.setCustomId("lyrics")
			.setDisabled(state)
			.setEmoji(client.emotes.lyrics)
			.setStyle("SECONDARY")
	),
];
