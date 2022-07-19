// Deconstructed the constants we need in this file.`
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const _ = require("lodash");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Shows music queue"),
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

		const songs = [...queue.songs];

		const np = songs.shift();

		const q = songs.map(
			(song, i) =>
				`${`\`${i + 1}\`. [${song.name}](${song.url}) - \`${
					song.formattedDuration
				}\``}`
		);

		const totalSongs = q.length;
		const splittedSongs = _.chunk(q, 10);

		const pages = splittedSongs.map((c) =>
			new EmbedBuilder()
				.setTitle(`${totalSongs} songs in queue`)
				.setDescription(`${c.join("\n")}`)
				.addFields([
					{
						name: `Now Playing`,
						value: `**[${np.name}](${np.url}) - \`${np.formattedDuration}\`**`,
					},
				])
				.setColor("Random")
		);

		if (!pages.length)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Random")
						.setTitle(`Now Playing`)
						.setDescription(
							`**[${np.name}](${np.url}) - \`${np.formattedDuration}\`**`
						)
						.setThumbnail(np.thumbnail),
				],
			});

		if (pages.length < 2)
			return interaction.reply({
				embeds: pages,
			});
		else {
			const filter = (i) => i.user.id == interaction.user.id;
			client.util.page(interaction, pages, 60000, true, filter);
		}
	},
};
