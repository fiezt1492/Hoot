// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("seek")
		.setDescription("Seek to a position of song")
		.addIntegerOption((option) =>
			option
				.setName("time")
				.setDescription("Position in seconds")
				.setRequired(true)
		),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const time = interaction.options.getInteger("time");

		queue.seek(time);

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("RANDOM")
					.setDescription(`Seeked to \`${time}\``),
			],
		});
	},
};
