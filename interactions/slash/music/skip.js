// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip currently playing song"),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const Embed = new MessageEmbed();

		try {
			const song = await queue.skip();

			Embed.setDescription(
				`${client.emotes.success} | Skipped! Now playing:\n${song.name}`
			).setColor("GREEN");

			interaction.reply({
				embeds: [Embed],
			});
		} catch (e) {
			Embed.setDescription(`${client.emotes.error} | ${e}`).setColor("RED");
			interaction.reply({
				embeds: [Embed],
				ephemeral: true,
			});
		}
	},
};
