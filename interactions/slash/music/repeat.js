// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("repeat")
		.setDescription("Set repeat mode")
		.addStringOption((option) =>
			option
				.setName("mode")
				.setDescription("Repeat mode")
				.setRequired(true)
				.addChoices(
					{ name: "Off", value: "0" },
					{ name: "Song", value: "1" },
					{ name: "Queue", value: "2" }
				)
		),
	inVoiceChannel: true,
	category: "music",
	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		let mode = parseInt(interaction.options.getString("mode"));

		mode = queue.setRepeatMode(mode);

		mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Random")
					.setDescription(`Set repeat mode to \`${mode}\``),
			],
		});
	},
};
