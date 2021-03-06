import * as path from 'path';
import { Sequelize } from "sequelize-typescript";
import { Service } from "typedi";
import { v4 as uuid } from 'uuid';
import { HotTake } from "../model/hot.take";
import { MessageMeta } from "../model/interfaces/message.associated.model";
import { ConfigurationService } from "../services/configuration.service";
import { Logger } from "../services/logging.service";

@Service()
export class HotTakeDao {
    private readonly log: Logger = Logger.getLogger('HotTakeDao');

    private _db: Sequelize;
    private _isConnected: boolean = false;

    constructor(
        private _configService: ConfigurationService
    ) { }

    public async initialize(): Promise<void> {
        this._db = new Sequelize({
            database: 'hottake',
            dialect: 'sqlite',
            username: 'root',
            password: '',
            storage: path.join(this._configService.getDbDir(), '/hottake.db'),
            logging: false
        });

        this._db.addModels([HotTake]);

        try {
            await this._db.authenticate();
            await HotTake.sync(); // create the table if it doesn't yet exist
            this._isConnected = true;
            this.log.info('Connection to hottake.db has been established successfully.');
        } catch (error) {
            this.log.error('Unable to connect to the database:', error);
        }
    }

    public async createHotTake(greaterItem: string, lesserItem: string): Promise<string> {
        if (!this._isConnected) {
            this.log.error('Cannot create HotTake - no connection to hottake.db');
            return null;
        }

        let take: HotTake = await HotTake.create({
            id: uuid(),
            greaterItem: greaterItem,
            lesserItem: lesserItem
        });

        return take.id;
    }

    public async getHotTake(id: string): Promise<HotTake> {
        if (!this._isConnected) {
            this.log.error('Cannot get HotTake - no connection to hottake.db');
            return null;
        }

        return await HotTake.findByPk(id);
    }

    public async getHotTakeByMeta(meta: MessageMeta): Promise<HotTake> {
        const takes: Array<HotTake> = await HotTake.findAll({ where: meta });
        if (takes && takes.length > 0) {
            if (takes.length != 1) {
                this.log.error("Multiple hot takes logged with same message metadata");
            }
            return takes[0];
        }
        else if (this.log.isDebugEnabled()) {
            this.log.debug('Searched for hot take associated with message metadata', meta, 'but none were found');
        }
    }

    public async updateHotTakeAgreement(id: string, agreeCount: number, disagreeCount: number): Promise<void> {
        const update: Partial<HotTake> = { agreeCount: agreeCount, disagreeCount: disagreeCount };
        if (this.log.isDebugEnabled()) {
            this.log.debug(`Updating hot take agreement for id ${id}:`, update);
        }
        await HotTake.update(update, { where: { id: id } })
    }

    public async updateHotTakeAgrees(id: string, agreeCount: number): Promise<void> {
        const update: Partial<HotTake> = { agreeCount: agreeCount };
        if (this.log.isDebugEnabled()) {
            this.log.debug(`Updating hot take agreement for id ${id}:`, update);
        }
        await HotTake.update(update, { where: { id: id } })
    }

    public async updateHotTakeDisagrees(id: string, disagreeCount: number): Promise<void> {
        const update: Partial<HotTake> = { disagreeCount: disagreeCount };
        if (this.log.isDebugEnabled()) {
            this.log.debug(`Updating hot take agreement for id ${id}:`, update);
        }
        await HotTake.update(update, { where: { id: id } })
    }

    public async addMessageMetadata(id: string, meta: MessageMeta): Promise<void> {
        await HotTake.update(meta, { where: { id: id } });
    }
}