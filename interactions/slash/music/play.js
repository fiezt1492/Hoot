// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play music")
		.addBooleanOption((option) =>
			option
				.setName("skip")
				.setDescription("Whether to skip the current song or not")
		)
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("Song name or URL")
				.setRequired(true)
		),
	inVoiceChannel: true,

	async execute(interaction) {
		let name = interaction.options.getString("query");
		let skip = interaction.options.getBoolean("skip");
		// const helpEmbed = new MessageEmbed().setColor(0x4286f4);

		// helpEmbed.setTitle(`Help for \`${name}\` command`);

		interaction.client.distube.play(interaction.member.voice.channel, name, {
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
