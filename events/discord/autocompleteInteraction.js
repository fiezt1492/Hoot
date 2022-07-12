module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isAutocomplete()) return;

		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

		if (!command.autocomplete) return;

		if (!interaction.options.getFocused()) return;

		if (command.inVoiceChannel && !interaction.member.voice.channel) return;

		try {
			await command.autocomplete(interaction);
		} catch (err) {
			console.error(err);
		}
	},
};
