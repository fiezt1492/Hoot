const { MessageEmbed } = require("discord.js");

module.exports = {
	id: "next-track",

	async execute(interaction) {
		require("../../slash/music/skip").execute(interaction)
		// const { client, guild } = interaction;

		// const queue = client.distube.getQueue(guild);

		// if (!queue)
		// 	return interaction.reply({
		// 		content: `${client.emotes.error} | There is nothing playing!`,
		// 		ephemeral: true,
		// 	});

		// if (!queue.starter || queue.starter.id !== interaction.user.id)
		// 	return interaction.reply({
		// 		content: `${client.emotes.error} | You don't own this panel!`,
		// 		ephemeral: true,
		// 	});

		// const Embed = new MessageEmbed();

		// try {
		// 	const song = await queue.skip();

		// 	Embed.setColor("GREEN")
		// 		.setAuthor({
		// 			name: `${interaction.user.tag}`,
		// 			iconURL: `${interaction.user.displayAvatarURL()}`,
		// 		})
		// 		.setDescription(`${client.emotes.success} | Skipped!`)
		// 		.addField(`Now Playing`, `[\`${song.name}\`](${song.url})`);

		// 	interaction.reply({
		// 		embeds: [Embed],
		// 	});
		// } catch (error) {
		// 	Embed.setColor("RED")
		// 		.setTitle("ERROR")
		// 		.setDescription(`${error.message}`);

		// 	interaction.reply({
		// 		embeds: [Embed],
		// 		ephemeral: true,
		// 	});
		// }
		// return;
	},
};
