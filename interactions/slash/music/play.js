// Deconstructed the constants we need in this file.

const { MessageEmbed, Constants } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play music")
		.addStringOption((option) =>
			option
				.setName("song")
				.setDescription("Song name or URL")
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("skip")
				.setDescription("Whether to skip the current song or not")
		)
		.addChannelOption((option) =>
			option
				.setName("destination")
				.setDescription("Select a voice channel")
				.addChannelTypes(
					Constants.ChannelTypes.GUILD_STAGE_VOICE,
					Constants.ChannelTypes.GUILD_VOICE
				)
		),
	inVoiceChannel: true,

	async execute(interaction) {
		const name = interaction.options.getString("song");
		const skip = interaction.options.getBoolean("skip");
		const voiceChannel =
			interaction.options.getChannel("destination") ||
			interaction.member.voice.channel;

		// if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
		// 	return interaction.reply({
		// 		content: `${client.emotes.error} | ${voiceChannel} is not a valid voice channel!`,
		// 		ephemeral: true,
		// 	});
		// }

		interaction.client.distube.play(voiceChannel, name, {
			member: interaction.member,
			textChannel: interaction.channel,
			skip: skip,
		});

		await interaction.reply({
			content: `Finding \`${name}\`...`,
			ephemeral: true,
		});
	},
};
