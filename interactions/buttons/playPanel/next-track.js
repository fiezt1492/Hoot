const { EmbedBuilder } = require("discord.js");

module.exports = {
	id: "next-track",

	async execute(interaction) {
		require("../../slash/music/skip").execute(interaction)
	},
};
