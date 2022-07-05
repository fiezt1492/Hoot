// Deconstructed the constants we need in this file.
const { InteractionButtonPages } = require("discord-button-page");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Shows music queue"),
	inVoiceChannel: true,

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

		const tempArray = [];
		while (q.length) {
			tempArray.push(q.splice(0, 10));
		}

		const pages = tempArray.map((c) =>
			new MessageEmbed()
				.setTitle(`${totalSongs} songs in queue`)
				.setDescription(`${c.join("\n")}`)
				.addField(
					`Now Playing`,
					`**[${np.name}](${np.url}) - \`${np.formattedDuration}\`**`
				)
				.setColor("RANDOM")
		);

		if (!pages.length)
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RANDOM")
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

		const embedPages = new InteractionButtonPages()
			.setDuration(300000)
			.setEmbeds(pages)
			.setCountPage(true)
			.setColorButton(["SECONDARY", "DANGER", "SECONDARY"]);

		embedPages.build(interaction);
	},
};
