// Deconstructed the constants we need in this file.

const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("search")
		.setDescription("Search for a queue")
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("String to search")
				.setRequired(true)
		),
	inVoiceChannel: true,

	async execute(interaction) {
		const { client, message, guild } = interaction;
		const string = interaction.options.getString("query");
		// const Embed = new MessageEmbed();

		try {
			const searchResults = await client.distube.search(string, {
				limit: 20,
			});

			const embeds = searchResults.map(
				(song) => `\`${song.formattedDuration}\` - [${song.name}](${song.url})`
			);

			const selectMenuOptions = searchResults.map((s, i) => {
				return {
					label: `${s.name}`,
					description: `${s.url}`,
					value: `${i}`,
				};
			});

			const embedsArray = [];
			while (embeds.length) {
				embedsArray.push(embeds.splice(0, 10));
			}

			const selectMenuOptionsArray = [];
			while (selectMenuOptions.length) {
				selectMenuOptionsArray.push(selectMenuOptions.splice(0, 10));
			}

			const note = `> Note: If your wished song doesn't appear on the result list, please try again with the more specific name/query.`;

			const pages = embedsArray.map((c) =>
				new MessageEmbed()
					.setColor("RANDOM")
					.setTitle(
						`Total ${searchResults.length} results found for "${string}"`
					)
					.setDescription(`${c.join("\n")}\n\n${note}`)
					.setFooter({
						text: `There are ${c.length} songs in this result page`,
					})
			);

			const rows = selectMenuOptionsArray.map((selectMenuOption, i) => {
				const components = new MessageSelectMenu()
					.setCustomId("search")
					.setPlaceholder("Choose a song in here...")
					.addOptions(selectMenuOption)
					.addOptions({
						label: `${
							i < selectMenuOptionsArray.length - 1
								? `Next ${selectMenuOptionsArray[i + 1].length} results`
								: `Back to first ${selectMenuOptionsArray[0].length} results`
						}`,
						value: `more`,
					});
				return new MessageActionRow().addComponents(components);
			});

			let currentResult = 0;

			interaction.reply({
				embeds: [pages[currentResult]],
				components: [rows[currentResult]],
			});

			const msg = await interaction.fetchReply();

			const filter = (i) => i.user.id === interaction.user.id;

			const msgCol = msg.createMessageComponentCollector({
				filter,
				componentType: "SELECT_MENU",
				time: 60_000,
			});

			msgCol.on("collect", (i) => {
				const value = i.values[0];
				if (value !== "more") return msgCol.stop();
				msgCol.resetTimer();
				if (currentResult++ >= selectMenuOptionsArray.length - 1)
					currentResult = 0;
				i.update({
					embeds: [pages[currentResult]],
					components: [rows[currentResult]],
				});
			});

			msgCol.on("end", (collected, reason) => {
				if (reason === "time")
					return interaction.editReply({
						embeds: [
							new MessageEmbed().setColor("RED").setTitle("Search timed out"),
						],
						components: [],
					});

				const songIndex = parseInt(collected.last().values[0]);
				const song = searchResults[songIndex];
				interaction.client.distube.play(
					interaction.member.voice.channel,
					song,
					{
						member: interaction.member,
						textChannel: interaction.channel,
					}
				);

				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor("RANDOM")
							.setTitle(`${song.name} - ${song.formattedDuration}`)
							.setURL(song.url),
					],
					components: [],
				});
			});
		} catch (error) {
			const errorEmbed = new MessageEmbed()
				.setColor("RED")
				.setTitle("ERROR")
				.setDescription(`${client.emotes.error} | ${error.message}`);
			interaction.reply({
				embeds: [errorEmbed],
			});
			console.log(error);
		}
	},
};
