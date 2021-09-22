import { CommandInteraction, Guild, GuildEmojiManager, Message, MessageReaction, PartialMessage, User } from "discord.js";
import _ from 'lodash';
import { Service } from "typedi";
import { EventConstants } from "../constants/event.constants";
import { HotTakeDao } from "../dao/hot.take.dao";
import { HotTake } from "../model/hot.take";
import { EventService } from "./event.service";
import { Logger } from "./logging.service";

@Service()
export class HotTakeService {
    private readonly log: Logger = Logger.getLogger("HotTakeService");

    constructor(
        private _dao: HotTakeDao,
        private _eventService: EventService
    ) { }

    public initialize(): void {
        this._eventService.register(EventConstants.MessageReactionAdd, this, (data: { reaction: MessageReaction, user: User }) => {
            this._handleMessageReactionsChanged(data.reaction, data.user);
        });

        this._eventService.register(EventConstants.MessageReactionRemove, this, (data: { reaction: MessageReaction, user: User }) => {
            this._handleMessageReactionsChanged(data.reaction, data.user);
        });
    }

    public async createNewHotTake(interaction: CommandInteraction): Promise<void> {
        await interaction.deferReply();

        const candidates: Array<string> = this._getHotTakeCandidates(interaction);
        const [greaterItem, lesserItem]: Array<string> = _.shuffle(candidates).slice(-2);

        const id: string = await this._dao.createHotTake(greaterItem, lesserItem);
        if (id) {
            const take: HotTake = await this._dao.getHotTake(id);
            if (take) {
                const message: Message = await interaction.editReply(this._getUserFriendlyTake(take)) as Message;
                await this._dao.addMessageMetadata(id, {
                    messageId: message.id,
                    channelId: message.channelId,
                    guildId: message.guildId
                })
                await message.react(this._getAgreeEmoji(interaction.guild));
                await message.react(this._getDisagreeEmoji(interaction.guild));
                return;
            }
        }

        await interaction.editReply("An error occurred while creating new hot take.");
    }

    private async _handleMessageReactionsChanged(reaction: MessageReaction, user: User): Promise<void> {
        const message: Message | PartialMessage = reaction.message;
        if (message && message.id && message.channelId && message.guildId) {
            const take: HotTake = await this._dao.getHotTakeByMeta({ messageId: message.id, channelId: message.channelId, guildId: message.guildId });
            if (take) {
                if (this.log.isDebugEnabled()) {
                    this.log.debug("Found hot take for message reactions.", message.reactions);
                }
                // TODO 
                // Get agree and disagree count, update database

                // If this reaction is in conflict with the user's previous vote, remove the old vote

                // If applicable, add to hall of based

                // Maybe add an emoji to indicate if this is a very hot or very cold (or based/unbased) take?

                // I've tried several variants on this code and I can't seem to pull the current reaction counts off
                // const agreeReact: MessageReaction = message.reactions.cache.get(this._getAgreeEmoji(message.guild));
                // const disagreeReact: MessageReaction = message.reactions.cache.get(this._getDisagreeEmoji(message.guild));
                // this._dao.updateHotTakeAgreement(take.id, agreeReact.count, disagreeReact.count);
            }
        }
    }

    private _getUserFriendlyTake(take: HotTake): string {
        return `${take.greaterItem} > ${take.lesserItem}`;
    }

    private _getAgreeEmoji(guild: Guild): string {
        const emojiMgr: GuildEmojiManager = guild.emojis;
        return emojiMgr.resolveIdentifier('<:golden:888931156769247242>');
    }

    private _getDisagreeEmoji(guild: Guild): string {
        const emojiMgr: GuildEmojiManager = guild.emojis;
        return emojiMgr.resolveIdentifier('<:catharsis:889059877505368104>');
    }

    private _getHotTakeCandidates(interaction: CommandInteraction): Array<string> {
        // TODO replace with something more generic?
        // And maybe *don't* recompute this list every time?
        const aeDiscog = require('../../res/autechre/autechre_track_names.json');
        let candidates = [];
        for (let [releaseType, releases] of Object.entries(aeDiscog)) {
            if (releaseType !== 'Live') {
                for (let [releaseName, release] of Object.entries(releases)) {
                    if (release.Year >= 0 && release.Year <= 3000) {
                        candidates = candidates.concat(release.Tracks);
                    }
                }
            }
        }

        return candidates;
    }
}