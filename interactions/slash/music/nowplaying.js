// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Whats the playing song?"),
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

		const song = queue.songs[0];

		const descriptionArray = [];

		if (song.isLive) descriptionArray.push(`🔴 \`Live\``);
		else {
			descriptionArray.push(
				`⌛ \`${queue.formattedCurrentTime}\``
			);
		}

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

		const Embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`${song.name}`)
			.setURL(song.url)
			.setThumbnail(song.thumbnail)
			.setFooter({
				text: `${song.formattedDuration} | ${client.status(queue)}`,
			});

		if (descriptionArray.length) {
			const stat = descriptionArray.join(" | ");
			Embed.setDescription(`${stat}`);
		}

		interaction.reply({
			embeds: [Embed],
		});
	},
};
