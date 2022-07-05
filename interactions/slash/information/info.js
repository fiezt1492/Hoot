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
		.setDescription("Get information about something")
		.addSubcommand((sub) =>
			sub.setName("guild").setDescription("Information about this guild")
		)
		.addSubcommand((sub) =>
			sub.setName("bot").setDescription("Information about the bot")
		)
		.addSubcommand((sub) =>
			sub
				.setName("user")
				.setDescription("Information about a user")
				.addUserOption((option) =>
					option
						.setName("target")
						.setDescription("Mention a user")
						.setRequired(false)
				)
		),
	category: "information",
	async execute(interaction) {
		const { client, guild } = interaction;

		let sub = interaction.options.getSubcommand();

		if (sub == "guild") {
			const { client, guild } = interaction;
			const owner = await guild.fetchOwner();
			const guildChannels = await guild.channels.fetch();
			const guildRoles = await guild.roles.fetch();
			const guildMembers = await guild.members.fetch();

			const channels = {
				voice: guildChannels.filter((c) => c.isVoice()).size,
				text: guildChannels.filter((c) => c.isText()).size,
			};

			const members = {
				user: guildMembers.filter((m) => m.user.bot !== true).size,
				bot: guildMembers.filter((m) => m.user.bot === true).size,
			};

			const features = await guild.features.map((f) =>
				capitalizeFirstLetter(f.toLowerCase().replace(/_+/g, " "))
			);

			const Embed = new Discord.MessageEmbed()
				.setTitle(guild.name + "'s Informations")
				.setColor("RANDOM")
				.setThumbnail(guild.iconURL({ size: 1024, dynamic: true }))
				.addField("Owner", `\`\`\`${owner.user.tag}\`\`\``)
				.addField("Roles", "```" + guildRoles.size + " roles```", true)
				.addField(
					channels.voice + channels.text + " Channels",
					`\`\`\`Texts: ${channels.text}\nVoices: ${channels.voice}\`\`\``,
					true
				)
				.addField(
					guild.memberCount + " Members",
					`\`\`\`Users: ${members.user}\nBots: ${members.bot}\`\`\``,
					true
				)
				.addField("Features", "```" + features.join(", ") + "```")
				.addField(
					"Additional",
					`\`\`\`Created at: ${timeConverter(
						guild.joinedTimestamp
					)}\nVerification Level: ${guild.verificationLevel}\nBoost Level: ${
						guild.premiumTier
					}\nBoost Count: ${
						guild.premiumSubscriptionCount
					}\nPreferred Locale: ${guild.preferredLocale}\`\`\``
				)
				.setFooter({ text: `Guild ID: ${guild.id}` })
				.setTimestamp(guild.joinedTimestamp);

			return interaction.reply({
				embeds: [Embed],
			});
		} else if (sub == "user") {
			const user = interaction.options.getUser("target") || interaction.user;

			const getUserBannerUrl = require("../../../modules/info/getUserBannerUrl");

			const guild = await client.guilds.fetch(interaction.guildId);

			const invites = await guild.invites.fetch();

			const invite = invites.size > 0 ? invites.first() : null;

			const member = await guild.members.fetch(user.id);

			const Embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setAuthor({
					name: user.tag,
				})
				.setThumbnail(user.displayAvatarURL({ dynamic: true }))
				.setDescription(
					`${
						member.avatar
							? "[Guild Avatar](" +
							  member.displayAvatarURL({ dynamic: true }) +
							  ")\n"
							: ""
					}Joined Discord since <t:${Math.round(
						user.createdTimestamp / 1000
					)}:R>\nJoined **${
						invite == null
							? guild.name
							: "[" + guild.name + "](" + invite.url + ")"
					}** since <t:${Math.round(member.joinedTimestamp / 1000)}:R>${
						member.premiumSinceTimestamp
							? "\nServer boosting since <t:" +
							  Math.round(member.premiumSinceTimestamp / 1000) +
							  ":R>"
							: ""
					}`
				)
				.setImage(await getUserBannerUrl(client, user.id));

			if (member.nickname) Embed.setTitle(member.nickname);

			const JPG = new Discord.MessageButton()
				.setStyle("LINK")
				.setLabel("JPG")
				.setURL(
					`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`
				);

			const PNG = new Discord.MessageButton()
				.setStyle("LINK")
				.setLabel("PNG")
				.setURL(
					`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
				);

			const WEBP = new Discord.MessageButton()
				.setStyle("LINK")
				.setLabel("WEBP")
				.setURL(
					`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
				);

			const ROW = new Discord.MessageActionRow().addComponents([
				WEBP,
				PNG,
				JPG,
			]);

			return await interaction.reply({
				embeds: [Embed],
				components: [ROW],
			});
		} else if (sub == "bot") {
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
				.addField("OSP", "```" + operatingSystemPlatform + "```", true)
				.addField("CPU", "```" + cpuModel + "```", true)
				.addField(
					"MEMORY",
					"```" + `SYSTEM: ${sysMemoryUsage}\nPROCESS: ${processField}` + "```",
					true
				)
				.addField("NODEJS", "```" + process.version + "```", true)
				.addField("DISCORD.JS", "```" + Discord.version + "```", true)
				.addField("GUILDS", "```" + guildSize + "```", true)
				.setFooter({ text: `A product of Owlvernyte` });

			return await interaction.reply({
				embeds: [Embed],
			});
		}
	},
};

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time =
		month + " " + date + " " + year + " " + hour + ":" + min + ":" + sec;
	return time;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}