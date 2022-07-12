// Deconstructed the constants we need in this file.
// const DisTube = require("DisTube");
const _ = require("lodash");
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Playlist"),
	inVoiceChannel: true,
	category: "music",
    skip: true,
	async execute(interaction) {
		return;
	},
	async autocomplete(interaction) {
		return;
	},
};
