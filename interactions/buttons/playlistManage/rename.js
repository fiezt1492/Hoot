const {
	EmbedBuilder,
	ActionRowBuilder,
	Modal,
	TextInputBuilder,
} = require("discord.js");

module.exports = {
	id: "plrename",

	async execute(interaction) {
		const { client, guild, message } = interaction;
		const name = message.embeds[0].title;

		if (name === "Favorite")
			return interaction.reply({
				content: `${client.emotes.error} | This playlist doesn't exist!`,
				ephemeral: true,
			});

		const exist = await client.db.models.Playlists.findOne({
			where: {
				playlistOwnerId: interaction.user.id,
				playlistId: `${name}`,
			},
		});

		if (exist === null)
			return interaction.reply({
				content: `${client.emotes.error} | This playlist doesn't exist!`,
				ephemeral: true,
			});

		const newNameInput = new TextInputBuilder()
			.setCustomId("name")
			.setMinLength(2)
			.setMaxLength(100)
			.setRequired(true)
			.setPlaceholder("New playlist name...")
			.setLabel("What's the new playlist name?")
			.setStyle("SHORT");

		const modal = new Modal()
			.setCustomId("plrename")
			.setTitle(`Rename Playlist`)
			.addComponents(new ActionRowBuilder().addComponents(newNameInput));

		interaction.showModal(modal);

		const filter = (i) => i.customId === "plrename";

		interaction
			.awaitModalSubmit({ filter, time: 60_000 })
			.then(async (i) => {
				const newName = i.fields.getTextInputValue("name");
				if (newName === "Favorite")
					return await i.reply({
						content: `${client.emotes.error} | You cannot change to this name!`,
						ephemeral: true,
					});

				const affectedRows = await client.db.models.Playlists.update(
					{
						playlistOwnerId: interaction.user.id,
						playlistId: `${newName}`,
					},
					{
						where: {
							playlistOwnerId: interaction.user.id,
							playlistId: name,
						},
					}
				);

				await i.reply({
					content: `${
						affectedRows > 0
							? `${client.emotes.success} | Changed from \`${name}\` to **${newName}**!`
							: `${client.emotes.error} | Failed to change \`${name}\` to **${newName}**`
					}`,
					ephemeral: true,
				});

				const existNew = await client.db.models.Playlists.findOne({
					where: {
						playlistOwnerId: interaction.user.id,
						playlistId: `${newName}`,
					},
				});

				if (existNew === null) return console.error("[RENAME] NULL");

				const managePanel = require("../../../constants/embeds/playlistManage");

				const components = require("../../../constants/components/playlistManage");

				await interaction.editReply({
					embeds: managePanel(
						existNew.dataValues.data.songs,
						existNew.dataValues.playlistId
					),
					components: [
						components(
							false,
							existNew.dataValues.data.songs,
							existNew.dataValues.playlistId
						),
					],
				});
			})
			.catch(console.error);
	},
};
