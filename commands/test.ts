const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('For testing')
        .addBooleanOption(option => option.setName('tester').setDescription('For testing').setRequired(true)),

    async execute(interaction) {
        await interaction.reply('Command is working.');
    }
}

export { };