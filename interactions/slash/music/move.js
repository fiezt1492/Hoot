// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("move")
		.setDescription("Move the song to other position")
		.addIntegerOption((option) =>
			option
				.setName("old_position")
				.setMinValue(1)
				.setDescription("Current song position")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("new_position")
				.setMinValue(1)
				.setDescription("New position")
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

		const old_position = interaction.options.getInteger("old_position");
		const new_position = interaction.options.getInteger("new_position");

		if (old_position === new_position)
			return interaction.reply({
				embeds: [
					new EmbedBuilder().setColor("Red").setDescription(`Nothing changed`),
				],
				ephemeral: true,
			});

		if (
			old_position > queue.songs.length - 1 ||
			new_position > queue.songs.length - 1
		)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							`One of two positions you entered (Old: \`${old_position}\`, New: \`${new_position}\`) is bigger than the queue length (\`${
								queue.songs.length - 1
							}\`)`
						),
				],
				ephemeral: true,
			});

		function array_move(arr, old_index, new_index) {
			if (new_index >= arr.length) {
				var k = new_index - arr.length + 1;
				while (k--) {
					arr.push(undefined);
				}
			}
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
			return arr; // for testing
		}

		array_move(queue.songs, old_position, new_position);

		const song = queue.songs[new_position];

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor("Random")
					.setDescription(
						`Moved [\`${song.name}\`](${song.url}) to \`${new_position}\``
					),
			],
		});
	},
};
