const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = (state, songs, name) =>
	new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("pladdsong")
			.setDisabled(songs.length === 100 ? true : state)
			.setLabel("Add song(s)")
			.setStyle("PRIMARY"),
		new ButtonBuilder()
			.setCustomId("plrename")
			.setDisabled(name === "Favorite" ? true : state)
			.setLabel("Rename")
			.setStyle("SECONDARY"),
		new ButtonBuilder()
			.setCustomId("plrefresh")
			.setDisabled(state)
			.setLabel("Refresh")
			.setStyle("SECONDARY"),
		new ButtonBuilder()
			.setCustomId("plshow")
			.setDisabled(!songs.length ? true : state)
			.setLabel("Show songs")
			.setStyle("SECONDARY"),
		// new ButtonBuilder()
		// 	.setCustomId("pldelsong")
		// 	.setDisabled(state)
		// 	.setLabel("Remove song(s)")
		// 	.setStyle("DANGER")
	);
