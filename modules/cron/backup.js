const cron = require("node-cron");
const fs = require("fs");
const {
	backup_channel_id,
	discloud_link,
	database,
} = require("../../config.json");

module.exports = (client) => {
	console.log("[CRON] Backup installed at 12:00 AM, only on Sunday UTC");

	cron.schedule("0 0 * * 0", () => {
		const readableStream = fs.createReadStream(
			`./${database.sqlite.file}`,
			"utf8"
		);

		fetch(discloud_link, {
			method: "POST",
			body: readableStream,
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				client.channels.fetch(backup_channel_id).then((channel) => {
					channel.send({
						content: `${data.longDownloadURL}\n\`\`\`${JSON.stringify(
							data
						)}\`\`\``,
					});
				});
			})
			.catch(console.error);
	});
};
