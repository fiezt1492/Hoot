const { InteractionType } = require("discord-api-types/v10");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		const { client } = interaction;

		if (interaction.type !== InteractionType.ApplicationCommandAutocomplete)
			return;

		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

		if (!command.autocomplete) return;

		if (!interaction.options.getFocused() && command.checkFocused)
			return await interaction.respond([]);

		if (command.inVoiceChannel && !interaction.member.voice.channel)
			return await interaction.respond([]);

		try {
			await command.autocomplete(interaction);
		} catch (err) {
			console.error(err);
		}
	},
};
