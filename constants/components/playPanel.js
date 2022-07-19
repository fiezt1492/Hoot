const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = (state, queue, client) => [
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("pause")
			.setDisabled(state)
			.setEmoji(client.emotes.playorpause)
			.setStyle(queue.paused ? "DANGER" : "SECONDARY"),
		new ButtonBuilder()
			.setCustomId("next-track")
			.setDisabled(state)
			.setEmoji(client.emotes.next)
			.setStyle("SECONDARY"),
		new ButtonBuilder()
			.setCustomId("volumeup")
			.setDisabled(queue.volume >= 100 ? true : state)
			.setEmoji(client.emotes.volume.high)
			.setStyle("SECONDARY"),
		new ButtonBuilder()
			.setCustomId("shuffle")
			.setDisabled(state)
			.setEmoji(client.emotes.shuffle)
			.setStyle("SECONDARY"),
		new ButtonBuilder()
			.setCustomId("addtopl")
			.setDisabled(state)
			.setEmoji(client.emotes.addtoplaylist)
			.setStyle("PRIMARY")
	),
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("autoplay")
			.setDisabled(state)
			.setEmoji("🅰")
			.setStyle(queue.autoplay ? "SUCCESS" : "DANGER"),
		new ButtonBuilder()
			.setCustomId("pre-track")
			.setDisabled(state)
			.setEmoji(client.emotes.previous)
			.setStyle("SECONDARY"),
		new ButtonBuilder()
			.setCustomId("volumedown")
			.setDisabled(queue.volume <= 0 ? true : state)
			.setEmoji(client.emotes.volume.medium)
			.setStyle("SECONDARY"),
		new ButtonBuilder()
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
		new ButtonBuilder()
			.setCustomId("lyrics")
			.setDisabled(state)
			.setEmoji(client.emotes.lyrics)
			.setStyle("SECONDARY")
	),
];
