// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Play previous song"),
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

		const Embed = new MessageEmbed();

		try {
			const song = await queue.previous();

			Embed.setColor("GREEN")
				.setDescription(`${client.emotes.success} | Played previous song!`)
				.addField(`Now Playing`, `[\`${song.name}\`](${song.url})`);

			interaction.reply({
				embeds: [Embed],
			});
		} catch (error) {
			Embed.setColor("RED")
				.setTitle("ERROR")
				.setDescription(`${error.message}`);

			interaction.reply({
				embeds: [Embed],
				ephemeral: true,
			});
		}
	},
};
