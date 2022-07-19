const { InteractionType, ComponentType } = require("discord-api-types/v10");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)

		if (interaction.type !== InteractionType.MessageComponent) return;

		if (interaction.componentType !== ComponentType.Button) return;

		const command = client.buttonCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultButtonError.js file!

		if (!command) {
			await require("../../messages/defaultButtonError").execute(interaction);
			return;
		}

		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			return interaction.reply({
				content: `${client.emotes.error} | You must be in a voice channel!`,
				ephemeral: true,
			});
		}

		// A try to execute the interaction.

		try {
			await command.execute(interaction);
			return;
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "There was an issue while executing that button!",
				ephemeral: true,
			});
			return;
		}
	},
};
