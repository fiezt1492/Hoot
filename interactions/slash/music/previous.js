// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Play previous song"),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const song = queue.previous();

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("RANDOM")
					.setTitle(song.name)
					.setURL(song.url)
					.setDescription(`Played previous song!`)
					.setAuthor({
						name: `${song.user.tag}`,
						iconURL: `${song.user.displayAvatarURL()}`,
					}),
			],
		});
	},
};
