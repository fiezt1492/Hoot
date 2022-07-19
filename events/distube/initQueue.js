const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "initQueue",
	execute(queue, client, status) {
		// console.log(queue);
		queue.starter = queue.songs[0].member;
	},
};
