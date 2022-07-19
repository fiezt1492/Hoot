const {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = async (
	interaction,
	embeds,
	duration,
	resetTimer = false,
	filter,
	pageNumber = false,
	components = [],
	ephemeral = false
) => {
	try {
		const row = (state) => {
			const pageButtons = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setEmoji("⬅")
					.setDisabled(state)
					.setCustomId("back-page"),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setEmoji("✖")
					.setDisabled(state)
					.setCustomId("stop-page"),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setEmoji("➡")
					.setDisabled(state)
					.setCustomId("next-page")
			);
			if (!components.length) return [pageButtons];

			return [pageButtons, ...components];
		};

		let currentPage = 0;

		if (interaction.isRepliable() && !interaction.replied)
			interaction
				.reply({
					embeds: [
						!pageNumber
							? embeds[currentPage]
							: embeds[currentPage].setFooter({
									text: `Page ${currentPage + 1}/${embeds.length}`,
							  }),
					],
					components: row(false),
					ephemeral: ephemeral,
				})
				.catch((error) => {
					console.error(error);
					if (error.name === "Error [INTERACTION_ALREADY_REPLIED]")
						interaction.editReply({
							embeds: [
								!pageNumber
									? embeds[currentPage]
									: embeds[currentPage].setFooter({
											text: `Page ${currentPage + 1}/${embeds.length}`,
									  }),
							],
							components: row(false),
						});
					else return;
				});

		const msg = await interaction.fetchReply().catch(console.error);

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: duration,
		});

		msgCol.on("collect", (i) => {
			if (i.customId === "stop-page") {
				i.update({
					components: row(true),
				}).catch(console.error);
				return msgCol.stop(i.customId);
			}

			if (resetTimer) msgCol.resetTimer();

			if (i.customId === "next-page")
				currentPage + 1 == embeds.length
					? (currentPage = 0)
					: (currentPage += 1);
			else if (i.customId === "back-page")
				currentPage - 1 < 0
					? (currentPage = embeds.length - 1)
					: (currentPage -= 1);

			i.update({
				embeds: [
					!pageNumber
						? embeds[currentPage]
						: embeds[currentPage].setFooter({
								text: `Page ${currentPage + 1}/${embeds.length}`,
						  }),
				],
				components: row(false),
			}).catch(console.error);
		});

		msgCol.on("end", (collected, reason) => {
			if (reason === "time")
				interaction
					.editReply({
						components: row(true),
					})
					.catch(console.error);
		});
	} catch (error) {
		interaction
			.reply({
				content: `**ERROR**: ${error.message}`,
				ephemeral: true,
			})
			.catch(console.error);
	}
};
