// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Play previous song"),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		require("../../../modules/music/skiprevious")(interaction, false)
	},
};
