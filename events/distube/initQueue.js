const { EmbedBuilder, Collection } = require("discord.js");

module.exports = {
	name: "initQueue",
	execute(queue, client) {
		queue.starter = queue.songs[0].member;
		queue.skipVotes = new Collection();
		queue.backVotes = new Collection();
	},
};
