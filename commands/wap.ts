const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wap')
        .setDescription('Wap')
        .addStringOption(option => option.setName('input').setDescription('Wap type')),
    async execute(interaction) {
        const string = interaction.options.getString('input');
        await interaction.reply(`Wap ${string}`);
    }
}
