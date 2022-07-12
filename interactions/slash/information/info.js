// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
// const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const os = require("os");
const packageJSON = require("../../../package.json");
const {
	SlashCommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandBuilder,
} = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get information about the bot"),
	category: "information",
	async execute(interaction) {
		const { client, guild } = interaction;

		const cpu = await os.cpus();
		const memTotal = await os.totalmem();
		const memFree = await os.freemem();
		const memUsed = memTotal - memFree;
		const memUsedInPercentage = Math.round((memUsed / memTotal) * 100);
		const processHeapUsed = Math.round(
			process.memoryUsage().heapUsed / 1024 / 1024
		);
		const processHeapTotal = Math.round(
			process.memoryUsage().heapTotal / 1024 / 1024
		);
		const processHeapUsedInPercentage = Math.round(
			(processHeapUsed / processHeapTotal) * 100
		);

		const operatingSystemPlatform = `${os.platform()}`;
		const cpuModel = `${cpu[0].model}`;
		const sysMemoryUsage = `${memUsedInPercentage}% (TOTAL: ${Math.round(
			memTotal / (1024 * 1024 * 1024)
		)}GB)`;

		const processField = `${processHeapUsedInPercentage}% (TOTAL: ${processHeapTotal}MB)`;

		const guildSize =
			client.shard == null
				? client.guilds.cache.size
				: await client.shard.fetchClientValues("guilds.cache.size");

		// console.log(client.shard)
		const Embed = new Discord.MessageEmbed()
			.setTitle(
				client.user.username + "'s STAT (ver: " + packageJSON.version + ")"
			)
			.setColor("RANDOM")
			.setThumbnail(client.user.displayAvatarURL())
			.addField(
				"SYSTEM",
				"```" + `OS: ${operatingSystemPlatform}\nCPU: ${cpuModel}` + "```",
				true
			)
			.addField(
				"MEMORY",
				"```" + `SYSTEM: ${sysMemoryUsage}\nPROCESS: ${processField}` + "```",
				true
			)
			.addField(
				"Version",
				`\`\`\`Node.js: ${process.version}\nDiscord.js: ${Discord.version}\nDisTube.js: ${client.distube.version}\`\`\``,
				true
			)
			.addField(
				"SIZES",
				"```" +
					`Shards: ${client.shard.count}\nServers: ${guildSize}\nPlaying/Connected: ${client.distube.queues.collection.size}/${client.distube.voices.collection.size}` +
					"```",
				true
			)
			.setFooter({ text: `https://owlvernyte.tk` });

		await interaction.reply({
			embeds: [Embed],
		});
	},
};
