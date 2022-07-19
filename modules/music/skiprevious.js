const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = async (interaction, skip = true) => {
	const { client, message, guild } = interaction;

	const queue = client.distube.getQueue(guild);

	if (!queue)
		return interaction.reply({
			content: `${client.emotes.error} | There is nothing playing!`,
			ephemeral: true,
		});

	const membersInVoice = interaction.member.voice.channel.members
		.filter((m) => !m.user.bot)
		.map((m) => m.id);

	const Embed = new EmbedBuilder();

	if (membersInVoice.length > 1) {
		const components = (state) => [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("voteYes")
					.setStyle(ButtonStyle.Success)
					.setDisabled(state)
					.setLabel("SKIP")
					.setEmoji(`${client.emotes.next}`)
			),
		];

		Embed.setColor("ORANGE")
			.setTitle(`${client.emotes.warning} VOTE TO SKIP`)
			.setDescription(`0/${membersInVoice.length} agree to skip`)
			.setFooter({
				text: `You guys have 1 min to confirm!`,
			});

		interaction.reply({
			embeds: [Embed],
			components: components(false),
		});

		const msg = await interaction.fetchReply();

		queue.skipPanel = {
			id: msg.id,
			channel: msg.channelId,
			url: msg.url,
		};

		const filter = (i) =>
			i.customId == "voteYes" && membersInVoice.includes(i.user.id);
		const msgCol = msg.createMessageComponentCollector({
			filter,
			time: 20000,
		});

		const agreed = new Set();

		msgCol.on("collect", (i) => {
			agreed.add(i.user.id);

			if (agreed.size == membersInVoice.length) return msgCol.stop("passed");

			i.update({
				embeds: [
					Embed.setDescription(
						`${agreed.size}/${membersInVoice.length} agree to skip`
					),
				],
			});
		});

		msgCol.on("end", async (collected, reason) => {
			delete queue.skipPanel;
			if (reason == "time")
				interaction.editReply({
					embeds: [
						Embed.setFooter({
							text: `Timed out! Keep playing current song!`,
						}),
					],
					components: [],
				});

			if (reason == "passed" && agreed.size == membersInVoice.length) {
				try {
					const song = skip ? await queue.skip() : await queue.previous();
					interaction.editReply({
						embeds: [
							Embed.setColor("GREEN")
								.setTitle("")
								.setDescription(`${client.emotes.success} | Skipped!`)
								.addFields([
									{
										name: `Now Playing`,
										value: `[\`${song.name}\`](${song.url})`,
									},
								])
								.setFooter({
									text: ``,
								}),
						],
						components: [],
					});
				} catch (error) {
					interaction.editReply({
						embeds: [
							new EmbedBuilder()
								.setColor("RED")
								.setTitle(`${client.emotes.error} ERROR`)
								.setDescription(`${error.message}`),
						],
						components: [],
					});
				}
			}
		});
	} else {
		try {
			const song = skip ? await queue.skip() : await queue.previous();

			Embed.setColor("GREEN")
				.setDescription(`${client.emotes.success} | Skipped!`)
				.addFields([
					{
						name: `Now Playing`,
						value: `[\`${song.name}\`](${song.url})`,
					},
				]);

			interaction.reply({
				embeds: [Embed],
			});
		} catch (error) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("RED")
						.setTitle(`${client.emotes.error} ERROR`)
						.setDescription(`${error.message}`),
				],
				ephemeral: true,
			});
		}
	}
};
