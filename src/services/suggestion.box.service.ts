import { Channel, CommandInteraction, GuildChannel } from "discord.js";
import { Service } from "typedi";
import { VilbotUtil } from "../util/vilbot.util";
import { ConfigurationService } from "./configuration.service";

@Service()
export class SuggestionBoxService {
    constructor(
        private _configService: ConfigurationService
    ) { }

    public async createSuggestion(interaction: CommandInteraction): Promise<void> {
        const suggestionboxChannelId: string = this._configService.getSuggestionBoxChannelId(interaction.guild.id); // Change this to data stored in a database per guild.

        if (VilbotUtil.checkIfChannelExists(interaction, suggestionboxChannelId)) {
            await interaction.reply({ content: 'No suggestion channel is set! Set one using /setsuggestionchannel.', ephemeral: true });
            return;
        }

        const suggestionboxChannel: Channel = await interaction.guild.channels.fetch(suggestionboxChannelId);

        if (suggestionboxChannel && suggestionboxChannel.isText()) {
            await suggestionboxChannel.send(this._createSuggentionboxPost(interaction));
            await interaction.reply({ content: 'Suggestion made', ephemeral: true });
        }
    }

    public async setSuggestionBoxChannel(interaction: CommandInteraction): Promise<void> {
        const channelOption: Channel = interaction.options.getChannel('channel') as GuildChannel;

        if (channelOption && channelOption.isText()) {
            await this._setSuggestionBoxChannel(channelOption);
            await interaction.reply("This feature has not been implemented yet!");
            // await interaction.reply({ content: `Set suggestion channel to ${channelOption.id}`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'Can only set Text Channels as the target', ephemeral: true });
        }
    }

    /**
     * @summary Creates a suggestion string
     * @param interaction The context where the command was called
     * @returns {string} The created suggestion string
     */
    private _createSuggentionboxPost(interaction: CommandInteraction) {
        const isAnonymous: boolean = interaction.options.getBoolean('anonymous') !== false;

        const author: string = isAnonymous ? "From: Anonymous" : `From: ${interaction.user.tag}`;
        const suggestion: string = interaction.options.getString('suggestion');

        return `**Suggestion**\n*${author}*\n> ${suggestion}`;
    }

    private async _setSuggestionBoxChannel(channel: Channel): Promise<void> {
        // TODO
    }
}