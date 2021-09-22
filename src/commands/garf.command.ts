import { SlashCommandBuilder } from "@discordjs/builders";
import * as Canvas from 'canvas';
import { CommandInteraction, MessageAttachment } from "discord.js";
import { Service } from "typedi";
import { CommandToken, ICommand } from "./interfaces/i.command";


@Service({ id: CommandToken, multiple: true })
export class GarfCommand implements ICommand {
    public static readonly NAME: string = 'garf';

    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('Garf')
            .addStringOption(option =>
                option.setName('mode')
                    .setDescription('Select the mode')
                    .setRequired(true)
                    .addChoice('yeet', 'yeet')
                    .addChoice('pipe', 'pipe')
                    .addChoice('generate', 'generate')
                    .addChoice('panel', 'panel')
            )
    }

    public getName(): string {
        return GarfCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const commandName = interaction.options.getString('mode');

        switch (commandName) {
            case 'yeet':
                var canvas: Canvas.Canvas = Canvas.createCanvas(600, 180);
                var context: Canvas.NodeCanvasRenderingContext2D = canvas.getContext('2d');

                // 13,313 garfield comics
                var selectedGarfComicPath: string = `../res/garfield/comics/garf_${Math.round(Math.random() * 13313)}.png`;
                var garfyeetImagePath: string = '../res/garfield/garfyeet.png';

                var background: Canvas.Image = await Canvas.loadImage(selectedGarfComicPath);
                var garfyeetImage: Canvas.Image = await Canvas.loadImage(garfyeetImagePath);

                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                context.drawImage(garfyeetImage, 392, 0, 208, canvas.height);

                var attachment: MessageAttachment = new MessageAttachment(canvas.toBuffer(), 'garfyeet.png');
                await interaction.reply({ files: [attachment] });

                break;
            case 'pipe':
                var canvas: Canvas.Canvas = Canvas.createCanvas(600, 180);
                var context: Canvas.NodeCanvasRenderingContext2D = canvas.getContext('2d');

                var garfieldpipeId: number = Math.round(Math.random() * 13313);
                var selectedGarfComicPath: string = `../res/garfield/comics/garf_${garfieldpipeId}.png`;
                var garfpipeVersion: string = "_original";

                if (garfieldpipeId <= 47) {
                    garfpipeVersion = "2";
                } else if (garfieldpipeId >= 48 && garfieldpipeId <= 1700) {
                    garfpipeVersion = "3";
                } else {
                    garfpipeVersion = "4";
                }

                var garfpipeImagePath: string = `../res/garfield/garfpipe${garfpipeVersion}.png`;

                var background: Canvas.Image = await Canvas.loadImage(selectedGarfComicPath);
                var garfpipeImage: Canvas.Image = await Canvas.loadImage(garfpipeImagePath);

                context.drawImage(background, 0, 0, canvas.width, canvas.height);
                context.drawImage(garfpipeImage, 392, 0, 208, canvas.height);

                var attachment: MessageAttachment = new MessageAttachment(canvas.toBuffer(), 'garfpipe.png');
                await interaction.reply({ files: [attachment] });

                break;
            case 'generate':
                // Generate a random garfield comic with each of the three panels 
                var canvas: Canvas.Canvas = Canvas.createCanvas(600, 180);
                var context: Canvas.NodeCanvasRenderingContext2D = canvas.getContext('2d');


                var garfComicPath: string = '../res/garfield/comics/garf_';

                for (var i = 0; i < 3; i++) {
                    var currentPanelPosition = Math.round((canvas.width / 3)) * i;
                    var garfComicId: number = Math.round(Math.random() * 13313)

                    var currentPanel: Canvas.Image = await Canvas.loadImage(`${garfComicPath}${garfComicId}.png`);

                    context.drawImage(currentPanel, currentPanelPosition, 0, canvas.width, canvas.height, currentPanelPosition, 0, canvas.width, canvas.height);
                }

                var attachment: MessageAttachment = new MessageAttachment(canvas.toBuffer(), 'garfpipe.png');
                await interaction.reply({ files: [attachment] });

                break;
            case 'panel':
                var canvas: Canvas.Canvas = Canvas.createCanvas(200, 200);
                var context: Canvas.NodeCanvasRenderingContext2D = canvas.getContext('2d');

                var panelWidth: number = 200;

                var garfComicPath: string = '../res/garfield/comics/garf_';
                var randomPanel: number = Math.round(Math.random() * 2);
                var garfComicId: number = Math.round(Math.random() * 13313);
                var garfComic: Canvas.Image = await Canvas.loadImage(`${garfComicPath}${garfComicId}.png`);

                context.drawImage(garfComic, randomPanel * panelWidth, 0, canvas.width, canvas.height, 0, 0, canvas.width + 20, canvas.height);

                var attachment: MessageAttachment = new MessageAttachment(canvas.toBuffer(), 'garfpipe.png');
                await interaction.reply({ files: [attachment] });

                break;
        }
    }
}
