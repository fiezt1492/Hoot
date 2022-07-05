// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Whats the playing song?"),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;

		const queue = client.distube.getQueue(guild);

		if (!queue)
			return interaction.reply({
				content: `${client.emotes.error} | There is nothing playing!`,
				ephemeral: true,
			});

		const song = queue.songs[0];

		const descriptionArray = [];

		if (song.views) descriptionArray.push(`👁 \`${millify(song.views)}\``);

		if (song.likes || song.dislikes)
			descriptionArray.push(
				`👍 \`${song.likes ? millify(song.likes) : "-"}\`/👎 \`${
					song.dislikes ? millify(song.dislikes) : "-"
				}\``
			);

		if (song.uploader) {
			descriptionArray.push(
				`🎙 ${
					song.uploader.url
						? `[${song.uploader.name ? song.uploader.name : "Unknown"}](${
								song.uploader.url
						  })`
						: `${song.uploader.name ? song.uploader.name : "Unknown"}`
				}`
			);
		}

		if (song.member) descriptionArray.push(`🎧 ${song.member}`);

		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle(`${song.name} - ${song.formattedDuration}`)
			.setURL(song.url)
			.setThumbnail(song.thumbnail);

		if (descriptionArray.length)
			Embed.setDescription(descriptionArray.join(" | "));

		interaction.reply({
			embeds: [Embed],
		});
	},
};
