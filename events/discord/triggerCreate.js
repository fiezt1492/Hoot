

module.exports = {
	name: "messageCreate",
	skip: true,
	async execute(message) {
		const args = message.content.split(/ +/);

		// Checks if the trigger author is a bot. Comment this line if you want to reply to bots as well.

		if (message.author.bot) return;

		// Checking ALL triggers using every function and breaking out if a trigger was found.

		/** @type {Number} */
		let check;

		message.client.triggers.every((trigger) => {
			if (check == 1) return false;
			trigger.name.every(async (name) => {
				if (check == 1) return false;

				// If validated, it will try to execute the trigger.

				if (message.content.includes(name)) {
					try {
						trigger.execute(message, args);
					} catch (error) {
						// If checks fail, reply back!

						console.error(error);
						message.reply({
							content: "there was an error trying to execute that trigger!",
						});
					}

					check = 1;
					return false;
				}
			});
		});
	},
};
