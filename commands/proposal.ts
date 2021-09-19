const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTimestamp, getUTCTimeStamp } = require('../utils/time-utils');

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
        ),
    async execute(interaction) {
        // create new proposal
        if (interaction.options.getSubcommand() === 'new') {
            const proposalStatus = createProposal(interaction);

            await interaction.reply(proposalStatus);

            // Check how many members are in proposals
        } else if (interaction.options.getSubcommand() === 'members') {
            const memberCount = getProposalRoleMembers(interaction);
            const votesToPass = Math.round(memberCount / 2);
            await interaction.reply(`${memberCount} proposal member${(memberCount > 1) ? "s" : ""}\n${votesToPass} vote${(votesToPass > 1 ? "s" : "")} to pass`);
        }
    }
}


/**
 * @summary Creates a proposal in the Proposals channel where users with the Proposal role can vote.
 * @param interaction The context where the command was called.
 * @returns {boolean} Returns true if successful, false otherwise.
 */
function createProposal(interaction) {
    // Set up all the parameters for the proposal
    const proposalContents = interaction.options.getString('proposal');
    const pingMode = interaction.options.getBoolean('ping') ? true : false;
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    const timeProposed = (function () {
        const d = new Date();
        return d.getTime();
    })();

    return `Proposal Contents: ${proposalContents}, Ping Mode: ${pingMode}, Guild ID: ${guildId}, User ID: ${userId}, Time proposed ${timeProposed}`;
}


// TODO: Offline users don't show up? This is because they're in the cache. 
/**
 * @summary Returns the members with the Proposal role
 * @param interaction The context where the command was called.
 * @returns {Array} An array of members. Undefined otherwise.
 */
function getProposalRoleMembers(interaction) {
    // Change this to be something called from a guild's database
    const proposalRole = '887200999935205377'
    const users = interaction.guild.members.cache;
    // console.log(users);

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

export { };