module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a button interaction (to prevent weird bugs)

		if (!interaction.isButton()) return;

		const command = client.buttonCommands.get(interaction.customId);

		// If the interaction is not a command in cache, return error message.
		// You can modify the error message at ./messages/defaultButtonError.js file!

		if (!command) {
			const refuseCustomIds = [
				"search0",
				"search1",
				"search2",
				"search3",
				"search4",
				"search5",
				"search6",
				"search7",
				"search8",
				"search9",
			];

			if (refuseCustomIds.includes(interaction.customId)) return;

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
