const { EmbedBuilder } = require("discord.js");

module.exports = {
	id: "pre-track",

	async execute(interaction) {
		require("../../slash/music/previous").execute(interaction)
	},
};
