const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = (state, songs, name) =>
	new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("pladdsong")
			.setDisabled(songs.length === 100 ? true : state)
			.setLabel("Add song(s)")
			.setStyle("PRIMARY"),
		new MessageButton()
			.setCustomId("plrename")
			.setDisabled(name === "Favorite" ? true : state)
			.setLabel("Rename")
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("plrefresh")
			.setDisabled(state)
			.setLabel("Refresh")
			.setStyle("SECONDARY"),
		new MessageButton()
			.setCustomId("plshow")
			.setDisabled(!songs.length ? true : state)
			.setLabel("Show songs")
			.setStyle("SECONDARY"),
		// new MessageButton()
		// 	.setCustomId("pldelsong")
		// 	.setDisabled(state)
		// 	.setLabel("Remove song(s)")
		// 	.setStyle("DANGER")
	);
