import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Service } from "typedi";
import { HotTakeService } from "../services/hot.take.service";
import { CommandToken, ICommand } from "./interfaces/i.command";

@Service({ id: CommandToken, multiple: true })
export class HotTakeCommand implements ICommand {
    public static readonly NAME: string = 'hottake';

    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    public static readonly NEW_HOT_TAKE: string = 'new';
    public static readonly CONTROVERSIAL_TAKES: string = 'topcontroversial'; // takes with about equal votes
    public static readonly COLD_TAKES: string = 'topcold'; // takes that everyone agrees with (maybe this is just based)
    public static readonly HOT_TAKES: string = 'tophot'; // takes that few people agree with (maybe this is just unbased)

    constructor(
        private _hotTakeService: HotTakeService
    ) {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('Options for hot takes')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(HotTakeCommand.NEW_HOT_TAKE)
                    .setDescription('Create a new take')
            );
    }

    public getName(): string {
        return HotTakeCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const subcommand: string = interaction.options.getSubcommand();
        switch (subcommand) {
            case HotTakeCommand.NEW_HOT_TAKE:
                return await this._hotTakeService.createNewHotTake(interaction);
            case HotTakeCommand.CONTROVERSIAL_TAKES:
                return await interaction.reply('This feature is not implemented yet!');
            case HotTakeCommand.COLD_TAKES:
                return await interaction.reply('This feature is not implemented yet!');
            case HotTakeCommand.HOT_TAKES:
                return await interaction.reply('This feature is not implemented yet!');
            default:
                return await interaction.reply(`Unknown command: ${subcommand}`);
        }
    }

}