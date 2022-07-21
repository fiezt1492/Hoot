// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("remove")
		.setDescription("Remove a song from queue")
		.addIntegerOption((option) =>
			option
				.setName("position")
				.setMinValue(1)
				.setDescription("Song position")
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

		const position = interaction.options.getInteger("position");

		if (position > queue.songs.length - 1)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							`The position you entered (\`${position}\`) is bigger than the queue length (\`${
								queue.songs.length - 1
							}\`)`
						),
				],
				ephemeral: true,
			});

		const removed = queue.songs.splice(position, 1).shift();

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Random")
					.setDescription(
						`Removed [\`${removed.name}\`](${removed.url}) from the queue.`
					),
			],
		});
	},
};
