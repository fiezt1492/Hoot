// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("Join a voice based channel")
		.addChannelOption((option) =>
			option
				.setName("destination")
				.setDescription("Select a voice channel")
				.addChannelTypes(
					Discord.Constants.ChannelTypes.GUILD_STAGE_VOICE,
					Discord.Constants.ChannelTypes.GUILD_VOICE,
				)
		),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		let voiceChannel =
			interaction.options.getChannel("destination") || interaction.channel;

		if (
			!Discord.Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)
		) {
			return interaction.reply({
				content: `${client.emotes.error} | ${voiceChannel} is not a valid voice channel!`,
				ephemeral: true,
			});
		}

		interaction.reply({
			content: `Joined ${voiceChannel}`,
			// ephemeral: true,
		});

		client.distube.voices.join(voiceChannel);
	},
};
