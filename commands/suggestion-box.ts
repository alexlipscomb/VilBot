const { SlashCommandBuilder } = require('@discordjs/builders');
const Sequelize = require('sequelize');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestionbox')
        .setDescription('A suggestion box')
        .addSubcommand(subcommand =>
            subcommand
                .setName('suggest')
                .setDescription('Make a suggestion')
                .addStringOption(option => option.setName('suggestion').setDescription('The suggestion').setRequired(true))
                .addBooleanOption(option => option.setName('anonymous').setDescription('Make the suggestion anonymously'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setsuggestionchannel')
                .setDescription('Set the channel where suggestions are sent')
                .addChannelOption(option => option.setName('channel').setDescription('The target channel').setRequired(true))
        ),

    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {

            // Create a suggestion in the suggestion channel
            case 'suggest':
                const suggestionboxChannelId = getGuildSuggestionboxChannel(interaction.guild.id); // Change this to data stored in a database per guild.

                if (checkIfChannelExists(interaction, suggestionboxChannelId)) {
                    await interaction.reply({ content: 'No suggestion channel is set! Set one using /setsuggestionchannel.', ephemeral: true });
                    break;
                }

                const suggestionboxChannel = interaction.guild.channels.fetch(suggestionboxChannelId)
                    .then(channel => channel.send(createSuggentionboxPost(interaction)));

                await interaction.reply({ content: 'Suggestion made', ephemeral: true });

                break;

            // Set the channel where suggestions go to
            case 'setsuggestionchannel':
                const setSuggestionboxChannelId = interaction.options.getChannel('channel');

                if (isTextChannel(suggestionboxChannelId)) {
                    setSuggestionboxChannel(setSuggestionboxChannelId);
                    await interaction.reply({ content: `Set suggestion channel to ${setSuggestionboxChannelId}`, ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Can only set Text Channels as the target', ephemeral: true });
                }

                break;
        }
    }
}

/**
 * @summary Creates a suggestion string
 * @param interaction The context where the command was called
 * @returns {string} The created suggestion string
 */
function createSuggentionboxPost(interaction) {
    const anonymousMode = interaction.options.getBoolean('anonymous')
    let isAnonymous = true

    if (anonymousMode === false) {
        isAnonymous = false;
    }

    const author = isAnonymous ? "From: Anonymous" : `From: ${interaction.user.tag}`;
    const suggestion = interaction.options.getString('suggestion');

    return `**Suggestion**\n*${author}*\n> ${suggestion}`;
}

function createSuggestionboxChannel(channelName: string) {
    return;
}


function setSuggestionboxChannel(channelId) {
    return;
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
function getGuildSuggestionboxChannel(guildId) {
    const suggestionboxChannelId = '889251642636124190'; // Change this to data stored in a database per guild.

    return suggestionboxChannelId;
}
