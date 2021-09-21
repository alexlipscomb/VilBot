import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Service } from "typedi";
import { SuggestionBoxService } from "../services/suggestion.box.service";
import { CommandToken, ICommand } from "./interfaces/i.command";

@Service({ id: CommandToken, multiple: true })
export class SuggestionBoxCommand implements ICommand {
    public static readonly NAME: string = 'suggestionbox';

    public static readonly NEW_SUGGESTION: string = 'suggest';
    public static readonly SET_CHANNEL: string = 'setsuggestionchannel';

    public data: Pick<SlashCommandBuilder, "name" | "toJSON">;

    constructor(
        private _suggestionBoxService: SuggestionBoxService
    ) {
        this.data = new SlashCommandBuilder()
            .setName(this.getName())
            .setDescription('A suggestion box')
            .addSubcommand(subcommand =>
                subcommand
                    .setName(SuggestionBoxCommand.NEW_SUGGESTION)
                    .setDescription('Make a suggestion')
                    .addStringOption(option => option.setName('suggestion').setDescription('The suggestion').setRequired(true))
                    .addBooleanOption(option => option.setName('anonymous').setDescription('Make the suggestion anonymously'))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName(SuggestionBoxCommand.SET_CHANNEL)
                    .setDescription('Set the channel where suggestions are sent')
                    .addChannelOption(option => option.setName('channel').setDescription('The target channel').setRequired(true))
            )
    }

    public getName(): string {
        return SuggestionBoxCommand.NAME;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const subcommand: string = interaction.options.getSubcommand();
        switch (subcommand) {
            // Create a suggestion in the suggestion channel
            case SuggestionBoxCommand.NEW_SUGGESTION:
                return await this._suggestionBoxService.createSuggestion(interaction);
            // Set the channel where suggestions go to
            case SuggestionBoxCommand.SET_CHANNEL:
                return await this._suggestionBoxService.setSuggestionBoxChannel(interaction);
            default:
                return await interaction.reply(`Unknown command: ${subcommand}`);
        }
    }
}
