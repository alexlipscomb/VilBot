const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

// WIP
module.exports = {
    data: new SlashCommandBuilder()
        .setName('garfyeet')
        .setDescription('Garf Yeet'),

    async execute(interaction) {
        const canvas = Canvas.createCanvas(600, 178);
        const context = canvas.getContext('2d');

        // Grab random Garfield comic

        // Grab the GarfYeet image

        // Load random Garfield comic onto the canvas

        // Place GarfYeet onto the comic

        // Save image to temp folder

        // Upload the image to discord

        // Delete the image


        await interaction.reply("Test");
    }
}


export { };