// Deconstructed the constants we need in this file.
// const DisTube = require("DisTube");
// const _ = require("lodash");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Playlist")
		.addSubcommand((sub) =>
			sub
				.setName("create")
				.setDescription("Create a new playlist")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						// .setMinLength(2)
						// .setMaxLength(100)
						.setRequired(true)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("manage")
				.setDescription("List your playlists")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("play")
				.setDescription("Create a new playlist")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("delete")
				.setDescription("Create a new playlist")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Enter playlist name")
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	// inVoiceChannel: true,
	category: "music",
	// skip: true,
	async execute(interaction) {
		const { client } = interaction;
		const Embed = new MessageEmbed().setColor("RANDOM");
		const subcommand = interaction.options.getSubcommand();
		const name = interaction.options.getString("name");
		await interaction.deferReply({ ephemeral: true });

		try {
			switch (subcommand) {
				case "create":
					playlistCreate(interaction, name);
					break;
				case "manage":
					playlistManage(interaction, name);
					break;
				case "play":
					playlistPlay(interaction, name);
					break;
				case "delete":
					playlistDelete(interaction, name);
					break;
			}
		} catch (error) {
			interaction.editReply({
				embeds: [
					Embed.setColor("RED")
						.setTitle("ERROR")
						.setDescription(`\`\`\`${error.message}\`\`\``),
				],
			});
			console.error(error);
		}

		// console.log(client.db);
	},
	async autocomplete(interaction) {
		const { client } = interaction;
		const { db } = client;
		const subcommand = interaction.options.getSubcommand();

		const userPlaylistsModels = await db.models.Playlists.findAll({
			where: {
				playlistOwnerId: interaction.user.id,
			},
		});

		const userPlaylists = userPlaylistsModels.map((model) => ({
			name: model.dataValues.playlistId,
			length: model.dataValues.data.songs.length,
		}));

		await interaction.respond(
			userPlaylists.map((result) => ({
				name: `${result.name} - ${result.length} songs`,
				value: `${result.name}`,
			}))
		);
	},
};

async function playlistCreate(interaction, name) {
	const { client } = interaction;

	// if (name === "Favorite")
	// 	return interaction.editReply({
	// 		content: `${client.emotes.error} | Uh oh! You should not create this playlist due to it is default playlist!`,
	// 	});

	const count = await client.db.models.Playlists.count({
		where: { playlistOwnerId: interaction.user.id },
	});

	if (count > 10)
		return interaction.editReply({
			content: `${client.emotes.error} | You have reached maximum playlists (\`10\`). Delete some before create a new one!`,
		});

	const [playlist, created] = await client.db.models.Playlists.findOrCreate({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
		defaults: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (!created)
		return interaction.editReply({
			content: `${client.emotes.error} | You already have that playlist`,
		});

	interaction.editReply({
		content: `${client.emotes.success} | Created **${playlist.dataValues.playlistId}**!`,
	});
}

async function playlistManage(interaction, name) {
	const { client } = interaction;

	const exist = await client.db.models.Playlists.findOne({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (exist === null)
		return interaction.editReply({
			content: `${client.emotes.error} | That playlist doesn't exist!`,
		});

	const managePanel = require("../../../constants/embeds/playlistManage");

	const components = require("../../../constants/components/playlistManage");

	await interaction.editReply({
		embeds: managePanel(
			exist.dataValues.data.songs,
			exist.dataValues.playlistId
		),
		components: [
			components(
				false,
				exist.dataValues.data.songs,
				exist.dataValues.playlistId
			),
		],
		ephemeral: true,
	});
}

async function playlistPlay(interaction, name) {
	const { client } = interaction;

	if (!interaction.member.voice.channel) {
		return interaction.reply({
			content: `${client.emotes.error} | You must be in a voice channel!`,
			ephemeral: true,
		});
	}

	const exist = await client.db.models.Playlists.findOne({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (exist === null)
		return interaction.editReply({
			content: `${client.emotes.error} | That playlist doesn't exist!`,
		});

	if (!exist.dataValues.data.songs.length)
		return interaction.editReply({
			content: `${client.emotes.error} | This playlist is empty! Add some songs!`,
		});

	const playlist = await client.distube.createCustomPlaylist(
		exist.dataValues.data.songs,
		{
			member: interaction.member,
			properties: { name: `${exist.dataValues.playlistId}` },
			parallel: true,
		}
	);

	client.distube.play(interaction.member.voice.channel, playlist, {
		member: interaction.member,
		textChannel: interaction.channel,
	});

	interaction.editReply({
		content: `${client.emotes.success} | Playing **${playlist.name}**...`,
	});
}

async function playlistDelete(interaction, name) {
	const { client } = interaction;

	// if (name === "Favorite")
	// 	return interaction.editReply({
	// 		content: `${client.emotes.error} | That playlist is a default playlist! You cannot delete that!`,
	// 	});

	const exist = await client.db.models.Playlists.findOne({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	if (exist === null)
		return interaction.editReply({
			content: `${client.emotes.error} | That playlist doesn't exist!`,
		});

	const deleted = await client.db.models.Playlists.destroy({
		where: {
			playlistOwnerId: interaction.user.id,
			playlistId: `${name}`,
		},
	});

	interaction.editReply({
		content: `${
			deleted > 0
				? `${client.emotes.success} | Deleted!`
				: `${client.emotes.error} | Failed to delete`
		}`,
	});
}
