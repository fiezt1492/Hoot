// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const defaultFilters = Object.keys(require("distube").defaultFilters).map(
	(mf) => {
		return {
			name: `${mf.toLocaleUpperCase()}`,
			value: mf,
		};
	}
);

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("filter")
		.setDescription("Add or remove filter(s)")
		.addStringOption((option) =>
			option
				.setName("filter")
				.setDescription("Choose a filter")
				.setRequired(true)
				.addChoices({
					name: "OFF",
					value: "off",
				})
				.addChoices(...defaultFilters)
		),
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

		const filter = interaction.options.getString("filter");

		if (filter === "off" && queue.filters.size) queue.filters.clear();
		else if (Object.keys(client.distube.filters).includes(filter)) {
			if (queue.filters.has(filter)) queue.filters.remove(filter);
			else queue.filters.add(filter);
		}

		const Embed = new EmbedBuilder()
			.setColor("Blurple")
			.setTitle(`Current Queue Filter`)
			.setDescription(`\`${queue.filters.names.join(", ") || "None"}\``);

		interaction.reply({
			embeds: [Embed],
		});
	},
};
