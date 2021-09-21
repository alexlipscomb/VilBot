import { MessageEmbed } from "discord.js";
const { SlashCommandBuilder, userMention, memberNicknameMention, channelMention, roleMention, time } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('proposal')
        .setDescription('Options for proposals')
        .addSubcommand(subcommand =>
            subcommand
                .setName('new')
                .setDescription('Create a new proposal')
                .addStringOption(option => option.setName('proposal').setDescription('The proposal').setRequired(true))
                .addBooleanOption(option => option.setName('ping').setDescription('Pings users with proposal role'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('members')
                .setDescription('Get the number of members with the proposal role and how many votes are needed to pass')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setproposalchannel')
                .setDescription('Set which channel proposals will be sent to')
                .addChannelOption(option => option.setName('channel').setDescription('The target channel').setRequired(true))
        ),

    async execute(interaction) {
        // create new proposal
        switch (interaction.options.getSubcommand()) {
            case 'new':
                const proposalEmbed = createProposalEmbed(interaction);

                const proposalMessage = await interaction.reply({ embeds: [proposalEmbed], fetchReply: true });
                const pingMode = interaction.options.getBoolean('ping') ? true : false;

                proposalMessage.startThread({ name: `Discuss ${interaction.options.getString('proposal').slice(0, 93)}`, autoArchiveDuration: 'MAX' });

                if (pingMode) {
                    proposalMessage.channel.send(roleMention('887200999935205377'));
                }

                break;
            // Check how many members are in proposals
            case 'members':
                const memberCount = getProposalRoleMembers(interaction);
                const votesToPass = Math.round(memberCount / 2);
                await interaction.reply(`${memberCount} proposal member${(memberCount > 1) ? "s" : ""}\n${votesToPass} vote${(votesToPass > 1 ? "s" : "")} to pass`);

                break;

            case 'setproposalchannel':

                break;
        }
    }
}


/**
 * @summary Creates a proposal in the Proposals channel where users with the Proposal role can vote
 * @param interaction The context where the command was called
 * @returns {boolean} Returns true if successful, false otherwise
 */
function createProposalEmbed(interaction) {
    // Set up all the parameters for the proposal
    const proposalContents = interaction.options.getString('proposal');
    const pingMode = interaction.options.getBoolean('ping') ? true : false;
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    const date = new Date().toUTCString()
    console.log(date);

    // Create proposal embed
    const embed = new MessageEmbed()
        .setColor('#eb6734')
        // .setTitle('')
        .setAuthor(interaction.user.tag, interaction.user.avatarURL)
        // .setDescription(`**Proposal**\n${proposalContents}\nDate Proposed${timeProposed.getDate()}`);
        .addFields(
            { name: 'Proposal', value: proposalContents, inline: false },
            { name: 'Date Proposed', value: date, inline: false }
        )

    return embed;
}


// TODO: Offline users don't show up? This is because they're in the cache. 
/**
 * @summary Returns the members with the Proposal role
 * @param interaction The context where the command was called
 * @returns {number} Returns the number of members
 */
function getProposalRoleMembers(interaction) {
    // Change this to be something called from a guild's database
    const proposalRole = '887200999935205377'
    const users = interaction.guild.members.cache;

    // Using the cache probably isn't a good long-term solution.
    // Users might be fluctuate depending on who's in the cache.
    var memberCount = 0;
    for (const user of users) {
        if (user[1]['user']['bot']) { continue };

        const userRoles = user[1]['_roles'];
        for (let i = 0; i < userRoles.length; i++) {
            if (userRoles[i] === proposalRole) {
                memberCount++;
            }
        }
    }

    return memberCount;
}

/**
 * 
 * @param interaction The context where the command was called
 * @param channelId The ID of the channel to check for
 * @returns {boolean} True if channel exists, false otherwise.
 */
function checkIfChannelExists(interaction, channelId: string) {
    try {
        const suggestionboxChannel = interaction.guild.channels.fetch(channelId);
        return false;

    } catch { // catch something useful here like the discord 404 not found error.
        return true;
    }
}

/**
 * @summary Checks to see if a Discord Channel is a Text Channel or not
 * @param channel The channel to test
 * @returns {boolean} True if the channel is a Text Channel, false otherwise
 */
function isTextChannel(channel) {
    switch (channel.type) {
        case 'GUILD_TEXT':
            return true;
        default:
            return false;
    }
}


// Find a way to keep the number of db calls down to a minimum. Maybe only make one call, then store it in an object.
function getGuildProposalChannel(guildId) {
    const proposalChannelId = '889251642636124190'; // Change this to data stored in a database per guild.

    return proposalChannelId;
}

export { };