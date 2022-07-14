const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	id: "favorite",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		// const queue = client.distube.getQueue(guild);

		// if (!queue)
		// 	return interaction.reply({
		// 		content: `${client.emotes.error} | There is nothing playing!`,
		// 		ephemeral: true,
		// 	});

		const [playlist, created] = await client.db.models.Playlists.findOrCreate({
			where: {
				playlistOwnerId: interaction.user.id,
				playlistId: `Favorite`,
			},
			defaults: {
				playlistOwnerId: interaction.user.id,
				playlistId: `Favorite`,
			},
		});

		const song = message.embeds[0].url;
		let duplicated = playlist.dataValues.data.songs.includes(song);

		const components = (state) => [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("favoriteYes")
					.setStyle("SUCCESS")
					.setDisabled(state)
					.setLabel("Yes"),
				new MessageButton()
					.setCustomId("favoriteNo")
					.setStyle("DANGER")
					.setDisabled(state)
					.setLabel("No")
			),
		];

		const Embed = new MessageEmbed()
			.setColor("ORANGE")
			.setTitle(`${client.emotes.warning} CAUTION`)
			.setDescription(
				`That song is already been in your **Favorite** playlist! Or you sure you want to add more?`
			)
			.setFooter({
				text: `You have 30 secs to confirm!`,
			});

		if (duplicated) {
			interaction.reply({
				embeds: [Embed],
				components: components(false),
				ephemeral: true,
			});
			const msg = await interaction.fetchReply();
			const filter = (i) =>
				(i.customId === "favoriteYes" || i.customId === "favoriteNo") &&
				i.user.id === interaction.user.id;
			msg
				.awaitMessageComponent({ filter, time: 30_000 })
				.then(async (i) => {
					// console.log(i);
					// if (msg.deletable) msg.delete();
					if (i.customId === "favoriteNo") {
						i.update({
							content: `${client.emotes.error} | Cancelled!`,
							embeds: [],
							components: [],
							ephemeral: true,
						});
					} else if (i.customId === "favoriteYes") {
						i.update({
							content: `${await addToFav()}`,
							embeds: [],
							components: [],
							ephemeral: true,
						});
					}
				})
				.catch((error) => {
					console.error(error.message);
					interaction.editReply({
						embeds: [
							Embed.setFooter({
								text: `Time out!`,
							}),
						],
						components: components(true),
					});
				});
		} else {
			interaction.reply({
				content: `${await addToFav()}`,
				ephemeral: true,
			});
		}

		async function addToFav() {
			const songs = [...playlist.dataValues.data.songs, song];

			const affectedRows = await client.db.models.Playlists.update(
				{
					data: {
						songs: songs,
					},
				},
				{
					where: {
						playlistOwnerId: interaction.user.id,
						playlistId: `Favorite`,
					},
				}
			);

			return `${
				affectedRows > 0
					? `${client.emotes.success} | Added \`${song}\` to your **Favorite** playlist!`
					: `${client.emotes.error} | Failed to add \`${song}\` to your **Favorite** playlist`
			}`;
		}

		return;
	},
};
