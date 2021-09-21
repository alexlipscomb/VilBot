import { SlashCommandBuilder } from "@discordjs/builders";
import * as Canvas from 'canvas';
import { CommandInteraction } from "discord.js";
import { Service } from "typedi";
import { CommandToken, ICommand } from "./interfaces/i.command";


@Service({ id: CommandToken, multiple: true })
export class GarfCommand implements ICommand {
    public static readonly NAME: string = 'garfyeet';

    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('Garf Yeet')
    }

    public getName(): string {
        return GarfCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const canvas: Canvas.Canvas = Canvas.createCanvas(600, 178);
        const context: Canvas.NodeCanvasRenderingContext2D = canvas.getContext('2d');

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

