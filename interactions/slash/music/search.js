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
		.setName("search")
		.setDescription("Search for a queue")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("String to search")
				.setAutocomplete(true)
				.setRequired(true)
		),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;
		const string = interaction.options.getString("query");

		const voiceChannel = interaction.member.voice.channel;

		interaction.client.distube.play(voiceChannel, string, {
			member: interaction.member,
			textChannel: interaction.channel,
		});

		await interaction.reply({
			content: `Adding \`${string}\`...`,
			ephemeral: true,
		});
	},
	async autocomplete(interaction) {
		const { client, guild } = interaction;

		const focusedValue = interaction.options.getFocused();
		
		const searchResults = await client.distube.search(focusedValue);

		await interaction.respond(
			searchResults.map((result) => ({
				name: `${result.name}`,
				value: `${result.url}`,
			}))
		);
	},
};
