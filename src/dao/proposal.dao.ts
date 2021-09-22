import { CommandInteraction } from "discord.js";
import { Sequelize } from "sequelize-typescript";
import { Service } from "typedi";
import { v4 as uuid } from 'uuid';
import { dbDir } from "../config.json";
import { MessageMeta } from "../model/interfaces/message.associated.model";
import { GuildSettings, Proposal } from "../model/proposal";
import { Logger } from "../services/logging.service";

@Service()
export class ProposalDao {
    private readonly log: Logger = Logger.getLogger('ProposalDao');

    private readonly connectErrorMsg: string = 'Cannot create Proposal - no conection to proposal.db';

    private _db: Sequelize;
    private _isConnected: boolean = false;

    constructor() { }

    public async initialize(): Promise<void> {
        this._db = new Sequelize({
            database: 'proposal',
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: dbDir + '/proposal.db',
            logging: false
        });

        this._db.addModels([Proposal, GuildSettings]);

        try {
            await this._db.authenticate();
            await Proposal.sync();
            await GuildSettings.sync();

            this._isConnected = true;
            this.log.info('Connection to proposal.db has been established successfully.');
        } catch (error) {
            this.log.error('Unable to connect to the database:', error);
        }
    }

    public async setProposalChannel(interaction: CommandInteraction): Promise<void> {
        if (!this._isConnected) {
            this.log.error(this.connectErrorMsg);
            return null;
        }

        const proposalChannelId: string = interaction.options.getChannel('channel').id;
        const guildId: string = interaction.guild.id;

        if (this._guildIsInitialized(guildId)) {
            const guildSettings = await GuildSettings.findOne({ where: { id: guildId } });
            guildSettings.update({ channelId: proposalChannelId });
        } else {
            await GuildSettings.create({
                id: guildId,
                channelId: proposalChannelId
            });
        }
    }



    public async createProposal(item: string, userId,): Promise<string> {
        if (!this._isConnected) {
            this.log.error(this.connectErrorMsg);
            return null;
        }

        let proposal: Proposal = await Proposal.create({
            id: uuid(),
            proposal: item,
            userId: userId
        });

        return proposal.id;
    }

    public async getProposalById(id: string): Promise<Proposal> {
        if (!this._isConnected) {
            this.log.error(this.connectErrorMsg);
            return null;
        }

        return await Proposal.findByPk(id);
    }

    public async addMessageMetadata(id: string, meta: MessageMeta): Promise<void> {
        await Proposal.update(meta, { where: { id: id } });
    }

    private async _guildIsInitialized(id: string): Promise<boolean> {
        const guildSettings: Array<GuildSettings> = await GuildSettings.findAll({ where: { id: id } });
        if (guildSettings) {
            if (guildSettings.length == 1) {
                return true;
            }
        }
        return false;
    }
}