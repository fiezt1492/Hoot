const cron = require("node-cron");
const { ActivityType } = require("discord-api-types/v10");

module.exports = (client) => {
	console.log(
		"[CRON] StatusChanger installed at 0 minutes past the hour, every 2 hours UTC"
	);
	const statuses = [
		{
			name: `${client.guilds.cache.size} servers | /play`,
			type: ActivityType.Watching,
		},
		{
			name: `hoot.owlvernyte.tk | /play`,
			type: ActivityType.Playing,
		},
		{
			name: `music | /play`,
			type: ActivityType.Listening,
		},
		{
			name: `hooooooooooooot | /play`,
			type: ActivityType.Playing,
		},
		{
			name: `music in ${client.distube.queues.collection.size} servers | /play`,
			type: ActivityType.Playing,
		},
	];

	const status = statuses[Math.floor(Math.random() * statuses.length)];

	client.user.setActivity(status.name, { type: status.type });

	cron.schedule("0 */2 * * *", () => {
		console.log(`[CRON] Status changed to ${status.name}`);
		client.user.setActivity(status.name, { type: status.type });
	});
};
