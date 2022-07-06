const { ActivityType } = require("discord-api-types/v10");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity(`music`, { type: ActivityType.Listening });

		setInterval(() => {
			const statuses = [
				{
					name: `${client.guilds.cache.size} servers`,
					type: ActivityType.Watching,
				},
				{
					name: `${client.channels.cache.size} channels`,
					type: ActivityType.Watching,
				},
				{
					name: `music`,
					type: ActivityType.Listening,
				},
				{
					name: `/play`,
					type: ActivityType.Playing,
				},
				{
					name: `music in ${client.distube.queues.collection.size} servers`,
					type: ActivityType.Playing,
				},
			];

			const status = statuses[Math.floor(Math.random() * statuses.length)];
			
			client.user.setActivity(status.name, { type: status.type });
		}, 7200000);
	},
};
