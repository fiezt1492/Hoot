// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("autoplay")
		.setDescription("Toggle autoplay mode"),
	category: "music",
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const autoplay = queue.toggleAutoplay();

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Random")
					.setTitle(`Autoplay: ${autoplay ? "On" : "Off"}`),
			],
		});
	},
};
