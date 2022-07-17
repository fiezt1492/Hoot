// Deconstructed the constants we need in this file.
// const DisTube = require("DisTube");
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
				.setAutocomplete(true)
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("position")
				.setDescription("Select the position you want to add to the queue")
				.setMinValue(1)
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
	checkFocused: true,
	category: "music",
	async execute(interaction) {
		const { client, guild } = interaction;
		const songName = interaction.options.getString("song");
		const skip = interaction.options.getBoolean("skip") || false;
		let position = interaction.options.getInteger("position") || 0;
		const voiceChannel =
			interaction.options.getChannel("destination") ||
			interaction.member.voice.channel;

		interaction.client.distube.play(voiceChannel, songName, {
			member: interaction.member,
			textChannel: interaction.channel,
			skip: skip,
			position: position,
		});

		await interaction.reply({
			content: `Finding \`${songName}\`...`,
			ephemeral: true,
		});
	},
	async autocomplete(interaction) {
		const { client, guild } = interaction;

		const focusedValue = interaction.options.getFocused();
		// console.log(focusedValue);
		const searchResults =
			(await client.distube.search(focusedValue).catch(() => [])) || [];

		await interaction.respond(
			searchResults.map((result) => ({
				name: `${result.name}`,
				value: `${result.url}`,
			}))
		);
	},
};
