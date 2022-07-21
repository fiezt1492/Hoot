const {
	InteractionType,
	ApplicationCommandType,
} = require("discord-api-types/v10");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a command (to prevent weird bugs)

		if (interaction.type !== InteractionType.ApplicationCommand) return;

		if (interaction.commandType !== ApplicationCommandType.ChatInput) return;

		const command = client.slashCommands.get(interaction.commandName);

		// If the interaction is not a command in cache.

		if (!command) return;

		// A try to executes the interaction.

		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			return interaction.reply({
				content: `${client.emotes.error} | You must be in a voice channel!`,
				ephemeral: true,
			});
		}

		// if (
		// 	command.sameVoiceChannel &&
		// 	interaction.member.voice.channelId !==
		// 		interaction.guild.me.voice.channelId
		// )
		// 	return interaction.reply({
		// 		content: `${client.emotes.error} | You must be in a same voice channel as me!`,
		// 		ephemeral: true,
		// 	});

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			if (interaction.isRepliable() && !interaction.replied)
				await interaction
					.reply({
						content: "There was an issue while executing that command!",
						ephemeral: true,
					})
					.catch(console.error);
		}
	},
};
