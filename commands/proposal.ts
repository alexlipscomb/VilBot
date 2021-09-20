import { MessageEmbed } from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

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
                const proposalEmbed = createProposal(interaction);
                await interaction.reply({ embeds: [proposalEmbed] });

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
function createProposal(interaction) {
    // Set up all the parameters for the proposal
    const proposalContents = interaction.options.getString('proposal');
    const pingMode = interaction.options.getBoolean('ping') ? true : false;
    const guildId = interaction.guild.id;
    const userId = interaction.user.id;
    const timeProposed = (function () {
        const d = new Date();
        return d;
    })();

    // Create proposal embed
    const embed = new MessageEmbed()
        .setColor('#eb6734')
        // .setTitle('')
        .setAuthor(interaction.user.tag, interaction.user.avatarURL)
        // .setDescription(`**Proposal**\n${proposalContents}\nDate Proposed${timeProposed.getDate()}`);
        .addFields(
            { name: 'Proposal', value: proposalContents, inline: false },
            { name: 'Date Proposed', value: "timeProposed", inline: false }
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

export { };