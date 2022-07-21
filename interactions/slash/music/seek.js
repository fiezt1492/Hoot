// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("seek")
		.setDescription("Seek to a position of song")
		.addIntegerOption((option) =>
			option
				.setName("time")
				.setMinValue(0)
				.setDescription("Position in seconds")
				.setRequired(true)
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

		const time = interaction.options.getInteger("time");

		if (time > queue.songs[0].duration)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							`The time you entered (second \`${time}\`) is bigger than the song duration (\`${queue.songs[0].duration}\`)`
						),
				],
				ephemeral: true,
			});

		queue.seek(time);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Random")
					.setDescription(`Seeked to second \`${time}\``),
			],
		});
	},
};
