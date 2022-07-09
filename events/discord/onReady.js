const { ActivityType } = require("discord-api-types/v10");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity(`music | /play`, { type: ActivityType.Listening });

		setInterval(() => {
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
		}, 7200000);
	},
};
