// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Leave the current voice"),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;

		client.distube.voices.leave(guild);

		const Embed = new EmbedBuilder()
			.setColor("Blurple")
			.setDescription("See yah!");

		interaction.reply({
			embeds: [Embed],
		});
	},
};
