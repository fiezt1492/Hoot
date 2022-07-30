const statusChanger = require("../../modules/cron/statusChanger");
const backup = require("../../modules/cron/backup");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		backup(client);
		statusChanger(client);
	},
};
