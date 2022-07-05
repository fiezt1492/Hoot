// Deconstructed the constants we need in this file.

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
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
		let Embed = new MessageEmbed();

		try {
			const searchResults = await client.distube.search(string);

			Embed.setColor("BLURPLE")
				.setTitle("Results")
				.setDescription(
					searchResults
						.map(
							(s, i) =>
								`\`${i + 1}\`. [${s.name}](${s.url}) - \`${
									s.formattedDuration
								}\``
						)
						.join("\n")
				)
				.setFooter({
					text: `If your wished song doesn't appear on the result list, please try again with the more specific name/query`,
				});

			const buttons = searchResults.map((s, i) =>
				new MessageButton()
					.setCustomId(`search${i}`)
					.setEmoji(buttonEmojies[`search${i}`])
					.setStyle("PRIMARY")
			);

			const tempArray = [];
			while (buttons.length) {
				tempArray.push(buttons.splice(0, 5));
			}

			const rows = tempArray.map((buttons) => {
				const tempRow = new MessageActionRow();
				buttons.forEach((btn) => {
					tempRow.components.push(btn);
				});
				return tempRow;
			});

			const customIdsRow = [
				"search0",
				"search1",
				"search2",
				"search3",
				"search4",
				"search5",
				"search6",
				"search7",
				"search8",
				"search9",
			];

			if (Embed.description)
				interaction.reply({
					embeds: [Embed],
					components: rows,
				});

			const msg = await interaction.fetchReply();

			const filter = (i) =>
				customIdsRow.includes(i.customId) && i.user.id === interaction.user.id;

			const msgCol = msg.createMessageComponentCollector({
				filter,
				componentType: "BUTTON",
				time: 60_000,
				max: 1,
			});

			// msgCol.on("collect", (i) => {});

			msgCol.on("end", (collected, reason) => {
				if (reason === "time")
					return interaction.editReply({
						embeds: [
							new MessageEmbed().setColor("RED").setTitle("Search timed out"),
						],
						components: [],
					});

				if (reason === "limit") {
					const songIndex = parseInt(collected.first().customId.slice(-1));
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
				}
			});
		} catch (error) {
			Embed.setColor("RED").setDescription(
				`${client.emotes.error} | ${error.message}`
			);
			interaction.reply({
				embeds: [Embed],
			});
		}
	},
};

const buttonEmojies = {
	search0: "1️⃣",
	search1: "2️⃣",
	search2: "3️⃣",
	search3: "4️⃣",
	search4: "5️⃣",
	search5: "5️⃣",
	search6: "6️⃣",
	search7: "7️⃣",
	search8: "9️⃣",
	search9: "🔟",
	searchx: "✖",
};
