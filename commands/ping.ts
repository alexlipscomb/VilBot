const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addStringOption(option => option.setName('input').setDescription('Input test')),
    async execute(interaction) {
        console.log(interaction.options.getString('input'));
        await interaction.reply('Pong!')
    }
}

