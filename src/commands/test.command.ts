import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Service } from "typedi";
import { CommandToken, ICommand } from "./interfaces/i.command";

@Service({ id: CommandToken, multiple: true })
export class TestCommand implements ICommand {
    public static readonly NAME: string = 'test';

    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('For testing')
            .addBooleanOption(option => option.setName('tester').setDescription('For testing').setRequired(true))
    }

    public getName(): string {
        return TestCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Command is working.');
    }
}