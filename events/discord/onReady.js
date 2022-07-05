const { ActivityType } = require("discord-api-types/v10");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity("music", { type: ActivityType.Listening });
	},
};
