const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = (state, songs, name) =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("pladdsong")
			.setDisabled(songs.length === 100 ? true : state)
			.setLabel("Add song(s)")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("plrename")
			.setDisabled(name === "Favorite" ? true : state)
			.setLabel("Rename")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("plrefresh")
			.setDisabled(state)
			.setLabel("Refresh")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("plshow")
			.setDisabled(!songs.length ? true : state)
			.setLabel("Show songs")
			.setStyle(ButtonStyle.Secondary),
		// new ButtonBuilder()
		// 	.setCustomId("pldelsong")
		// 	.setDisabled(state)
		// 	.setLabel("Remove song(s)")
		// 	.setStyle(ButtonStyle.Danger)
	);
