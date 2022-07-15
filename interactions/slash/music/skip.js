// Deconstructed the constants we need in this file.

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const sequelize = require("sequelize");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip currently playing song"),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		require("../../../modules/music/skiprevious")(interaction)
	},
};
