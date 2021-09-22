import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Service } from "typedi";
import { CommandToken, ICommand } from "./interfaces/i.command";

@Service({ id: CommandToken, multiple: true })
export class VilbotCommand implements ICommand {
    public static readonly NAME: string = 'vilbot';

    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('Vilbot options for this server');
    }

    public getName(): string {
        return VilbotCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Feature coming soon');
    }
}