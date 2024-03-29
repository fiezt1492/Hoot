// Deconstructed the constants we need in this file.

const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const {
    ApplicationCommandType,
} = require('discord-api-types/v10')

const {
    client_id,
    support_server_id,
    topggToken,
} = require('../../../config.json')
const { getInviteLinks } = require('../../../constants/inviteLinks')

const choices = [
    { name: 'Get command list', value: 'commands' },
    { name: 'Get relevant links', value: 'links' },
]

if (!!support_server_id)
    choices.push({ name: 'Support server', value: 'support' })

module.exports = {
    // The data needed to register slash commands to Discord.

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('This command will help you out')
        .addStringOption((option) =>
            option
                .setName('topic')
                .setDescription('Select a topic')
                .setRequired(true)
                .addChoices(...choices)
        ),
    category: 'information',

    async execute(interaction) {
        const { client, guild } = interaction

        const topic = interaction.options.getString('topic')

        const helpEmbed = new EmbedBuilder().setColor('Random')

        const { defaultInviteLink, adminInviteLink } = getInviteLinks(client)

        if (topic === 'commands') {
            const commands = (
                client.config.dev === 'on'
                    ? await guild.commands.fetch()
                    : await client.application.commands.fetch()
            )
                .filter((c) => c.type === ApplicationCommandType.ChatInput)
                .map(({ id, name, description }) => ({
                    id,
                    name,
                    description,
                }))

            helpEmbed
                .setTitle(`${client.user.username.toUpperCase()} COMMAND LIST`)
                .setThumbnail(client.user.displayAvatarURL())
                .setURL(defaultInviteLink)
                .setDescription(
                    `We use \`/command\` (Slash command) only! For further reason click [here](https://support-dev.discord.com/hc/en-us/articles/4404772028055).\n\n~~\`command\`~~: Maintaining command\n<\`command\`: In voice use only`
                )

            function formatCommand(cmd) {
                let gCmd = commands.find((c) => c.name === cmd.data.name)

                let name =
                    gCmd !== undefined
                        ? `</${gCmd.name}:${gCmd.id}>`
                        : `\`${cmd.data.name}\``

                if (cmd.inVoiceChannel) name = '<' + name
                if (cmd.maintain) name = '~~' + name + '~~'
                return name
            }

            let categories = [
                ...new Set(
                    client.slashCommands
                        .map((cmd) => cmd.category)
                        .filter((cate) => cate.toLowerCase() !== 'private')
                ),
            ]

            const commandsList = categories.map((cate) => {
                const getCommands = client.slashCommands.filter(
                    (cmd) => cmd.category === cate
                )
                return {
                    category: cate,
                    commands: getCommands,
                }
            })

            helpEmbed.addFields(
                commandsList.map((list) => ({
                    name: `${list.category.toUpperCase()}`,
                    value: `${list.commands
                        .map((cmd) => `${formatCommand(cmd)}`)
                        .join(', ')}`,
                }))
            )

            await interaction.reply({
                embeds: [helpEmbed],
            })
        } else if (topic === 'links') {
            helpEmbed.setDescription(
                `> Note: \`Not Recommend Invite Link\` is full permission (Administrator) invite link (Use as your own risk, we refuse to take responsibility if there is anything wrong with your server/data. Suggest to use if and only when the bot is not working correctly in your server).`
            )

            const buttons = [
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Invite Link (Recommend)')
                    .setURL(defaultInviteLink),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Invite Link (Not Recommend)')
                    .setURL(adminInviteLink),
            ]

            if (!!topggToken)
                buttons.push(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Vote')
                        .setURL(`https://top.gg/bot/${client_id}/vote`)
                )

            await interaction.reply({
                embeds: [helpEmbed],
                components: [new ActionRowBuilder().addComponents(...buttons)],
            })
        } else if (topic === 'support' && !!support_server_id) {
            const supportGuild = await client.guilds.fetch(support_server_id)

            await interaction.reply({
                content: `${await supportGuild.invites.create(
                    supportGuild.rulesChannelId
                )}`,
            })
        }
    },
}
