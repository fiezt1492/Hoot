// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Leave the current voice"),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;
		
		client.distube.voices.leave(guild);

		interaction.reply({
			embeds: [new MessageEmbed().setColor("BLURPLE").setTitle("Bye")],
		});
	},
};
