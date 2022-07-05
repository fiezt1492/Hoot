// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pause the queue"),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		if (queue.pause) {
			queue.resume();
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("BLURPLE")
						.setTitle("Resumed the song!")
						.setAuthor({
							name: `${interaction.user.tag}`,
							iconURL: `${interaction.user.displayAvatarURL()}`,
						}),
				],
			});
		}

		queue.pause();

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setTitle("Paused the song!"),
			],
		});
	},
};
