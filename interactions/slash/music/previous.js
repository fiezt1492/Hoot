// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Play previous song"),
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

		if (queue.backVotes.has(interaction.user.id))
			return interaction.reply({
				content: `${client.emotes.error} | You have already voted!`,
				ephemeral: true,
			});

		queue.backVotes.set(interaction.user.id, interaction.member);

		if (queue.backVotes.size < required)
			interaction.reply({
				embeds: [
					Embed.setColor("Blurple").setDescription(
						`${
							queue.backVotes.size
						}/${required} back votes\nVotes: ${queue.skipVotes
							.map((v) => `${v}`)
							.join(", ")}`
					),
				],
			});
		else if (queue.backVotes.size >= required) {
			queue.backVotes.clear();
			try {
				const song = await queue.previous();

				Embed.setColor("Green")
					.setDescription(`${client.emotes.success} | Backed!`)
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
