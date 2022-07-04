// Declare constants which will be used throughout the bot.

const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const intents = [
	"GUILDS",
	"GUILD_MEMBERS",
	"GUILD_EMOJIS_AND_STICKERS",
	"GUILD_INTEGRATIONS",
	"GUILD_WEBHOOKS",
	"GUILD_INVITES",
	"GUILD_VOICE_STATES",
	"GUILD_PRESENCES",
];

// @ts-ignore
const client = new Client({
	// Please add all intents you need, more detailed information @ https://ziad87.net/intents/
	intents: [intents],
	restTimeOffset: 0,
	// shard: "auto",
	ws: { intents: intents },
});

/**********************************************************************/
// Below we will be making an event handler!

const eventFiles = fs
	.readdirSync("./events/discord")
	.filter((file) => file.endsWith(".js"));

// Loop through all files and execute the event when it is actually emmited.
for (const file of eventFiles) {
	const event = require(`./events/discord/${file}`);
	if (event.skip) continue;
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client)
		);
	}
}

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns

client.config = require("./config.json");
client.distube = new DisTube(client, {
	leaveOnStop: false,
	emitNewSongOnly: true,
	emitAddSongWhenCreatingQueue: false,
	emitAddListWhenCreatingQueue: false,
	plugins: [
		new SpotifyPlugin({
			emitEventsAfterFetching: true,
		}),
		new SoundCloudPlugin(),
		new YtDlpPlugin(),
	],
	youtubeDL: false,
});
client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.triggers = new Collection();
client.emotes = client.config.emoji;

// /**********************************************************************/
// // Registration of Message-Based Legacy Commands.

// const commandFolders = fs.readdirSync("./commands");

// // Loop through all files and store commands in commands collection.

// for (const folder of commandFolders) {
// 	const commandFiles = fs
// 		.readdirSync(`./commands/${folder}`)
// 		.filter((file) => file.endsWith(".js"));
// 	for (const file of commandFiles) {
// 		const command = require(`./commands/${folder}/${file}`);
// 		client.commands.set(command.name, command);
// 	}
// }

/**********************************************************************/
// Registration of Slash-Command Interactions.

const slashCommands = fs.readdirSync("./interactions/slash");

// Loop through all files and store slash-commands in slashCommands collection.

for (const module of slashCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/slash/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/slash/${module}/${commandFile}`);
		if (client.config.dev !== "on" && command.dev) continue;
		if (command.maintain || command.guildOwner)
			command.data.setDefaultPermission(false);
		if (command.dm && command.dm == true) command.data.setDMPermission(true);
		else if (!command.dm || (command.dm && command.dm == false))
			command.data.setDMPermission(false);
		client.slashCommands.set(command.data.name, command);
	}
}

/**********************************************************************/
// Registration of Context-Menu Interactions

const contextMenus = fs.readdirSync("./interactions/context-menus");

// Loop through all files and store context-menus in contextMenus collection.

for (const folder of contextMenus) {
	const files = fs
		.readdirSync(`./interactions/context-menus/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of files) {
		const menu = require(`./interactions/context-menus/${folder}/${file}`);
		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
		client.contextCommands.set(keyName, menu);
	}
}

/**********************************************************************/
// Registration of Button-Command Interactions.

const buttonCommands = fs.readdirSync("./interactions/buttons");

// Loop through all files and store button-commands in buttonCommands collection.

for (const module of buttonCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/buttons/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/buttons/${module}/${commandFile}`);
		client.buttonCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Modal-Command Interactions.

/**
 * @type {String[]}
 * @description All modal commands.
 */

const modalCommands = fs.readdirSync("./interactions/modals");

// Loop through all files and store modal-commands in modalCommands collection.

for (const module of modalCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/modals/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/modals/${module}/${commandFile}`);
		client.modalCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of select-menus Interactions

const selectMenus = fs.readdirSync("./interactions/select-menus");

// Loop through all files and store select-menus in selectMenus collection.

for (const module of selectMenus) {
	const commandFiles = fs
		.readdirSync(`./interactions/select-menus/${module}`)
		.filter((file) => file.endsWith(".js"));
	for (const commandFile of commandFiles) {
		const command = require(`./interactions/select-menus/${module}/${commandFile}`);
		client.selectCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Slash-Commands in Discord API

const rest = new REST({ version: "10" }).setToken(client.config.token);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");
		if (client.config.dev && client.config.dev === "on") {
			if (!client.config.test_guild_id || !client.config.client_id)
				return console.log("Missing required guild");
			await rest.put(
				/**
			 * Here we are sending to discord our slash commands to be registered.
					There are 2 types of commands, guild commands and global commands.
					Guild commands are for specific guilds and global ones are for all.
					In development, you should use guild commands as guild commands update
					instantly, whereas global commands take upto 1 hour to be published. To
					deploy commands globally, replace the line below with:
				Routes.applicationCommands(client_id)
			 */
				// Routes.applicationCommands(client_id),
				Routes.applicationGuildCommands(
					client.config.client_id,
					client.config.test_guild_id
				),
				{ body: commandJsonData }
			);
		} else {
			await rest.put(Routes.applicationCommands(client.config.client_id), {
				body: commandJsonData,
			});
		}

		console.log(
			`Successfully reloaded ${
				dev === "on" ? "guild " + test_guild_id : "global"
			} application (/) commands.`
		);
	} catch (error) {
		console.error(error);
	}
})();

const status = (queue) =>
	`Volume: ${queue.volume}% | Filter: ${
		queue.filters.join(", ") || "Off"
	} | Loop: ${
		queue.repeatMode
			? queue.repeatMode === 2
				? "All Queue"
				: "This Song"
			: "Off"
	} | Autoplay: ${queue.autoplay ? "On" : "Off"}`;

const distubeEventFiles = fs
	.readdirSync("./events/distube")
	.filter((file) => file.endsWith(".js"));

// Loop through all files and execute the event when it is actually emmited.
for (const file of distubeEventFiles) {
	const event = require(`./events/distube/${file}`);
	if (event.skip) continue;
	if (event.once) {
		client.distube.once(event.name, (...args) =>
			event.execute(...args, client, status)
		);
	} else {
		client.distube.on(
			event.name,
			async (...args) => await event.execute(...args, client, status)
		);
	}
}

// Login into your client application with bot's token.

client.login(client.config.token);
