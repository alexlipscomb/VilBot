const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vilbot')
        .setDescription('Vilbot options for this server'),
    async execute(interaction) {
        await interaction.reply('Feature coming soon');
    }
}

export { };