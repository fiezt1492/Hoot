// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// const sequelize = require("sequelize");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip currently playing song"),
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

		const Embed = new EmbedBuilder();

		const membersInVoice = interaction.member.voice.channel.members.size;

		const required = Math.ceil(membersInVoice / 2);

		if (queue.skipVotes.has(interaction.user.id))
			return interaction.reply({
				content: `${client.emotes.error} | You have already voted!`,
				ephemeral: true,
			});

		queue.skipVotes.set(interaction.user.id, interaction.member);

		if (queue.skipVotes.size < required)
			interaction.reply({
				embeds: [
					Embed.setColor("Blurple").setDescription(
						`${
							queue.skipVotes.size
						}/${required} skip votes\nVotes: ${queue.skipVotes
							.map((v) => `${v}`)
							.join(", ")}`
					),
				],
			});
		else if (queue.skipVotes.size >= required) {
			queue.skipVotes.clear();
			try {
				const song = await queue.skip();

				Embed.setColor("Green")
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
							.setColor("Red")
							.setTitle(`${client.emotes.error} ERROR`)
							.setDescription(`${error.message}`),
					],
					ephemeral: true,
				});
			}
		}
	},
};
