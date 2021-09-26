import * as fs from 'fs';
import * as path from 'path';
import { Service } from "typedi";
import { Logger } from './logging.service';

@Service()
export class ConfigurationService {
    public static readonly DATABASE_DIR_PROP: string = 'dbDir';
    public static readonly PROPOSAL_CHANNEL_PROP: string = 'proposalChannelId';
    public static readonly PROPOSAL_ROLE_PROP: string = 'proposalRoleId';
    public static readonly SUGGESTION_BOX_PROP: string = 'suggestionBoxChannelId';
    public static readonly TOKEN_PROP: string = 'token';

    // These properties will be read from a config file to overwrite defaults
    private static readonly FILE_OVERRIDE_PROPERTIES: Array<string> = [
        ConfigurationService.DATABASE_DIR_PROP,
        ConfigurationService.PROPOSAL_CHANNEL_PROP,
        ConfigurationService.PROPOSAL_ROLE_PROP,
        ConfigurationService.SUGGESTION_BOX_PROP,
        ConfigurationService.TOKEN_PROP
    ]

    private static readonly VILBOT_API_KEY_ENV = 'VILBOT_API_KEY'; // this environment var will be checked for a token

    private readonly log: Logger = Logger.getLogger('ConfigurationService');

    private _config: any = {};

    constructor() { }

    public initialize(): void {
        // Set up defaults
        this._config[ConfigurationService.DATABASE_DIR_PROP] = path.resolve(global.__basedir, '..', 'db');

        // Read from config
        this._readConfigFromFile(path.resolve(global.__basedir, 'config.json'));

        // Set up token if not already present
        this._setupToken();

        // Create db folder if it doesn't exist already
        if (!fs.existsSync(this.getDbDir())) {
            fs.mkdirSync(this.getDbDir());
        }
    }

    public getDbDir(): string {
        const dbDir = this._config[ConfigurationService.DATABASE_DIR_PROP];
        if (this.log.isDebugEnabled()) {
            this.log.debug('Using database directory', dbDir);
        }
        return dbDir;
    }

    public getToken(): string {
        return this._config[ConfigurationService.TOKEN_PROP];
    }

    // Temp - this is only a configuration until it is moved to a db
    public getProposalRoleId(): string {
        return this._config[ConfigurationService.PROPOSAL_ROLE_PROP];
    }

    // Temp - this is only a configuration until it is moved to a db
    public getSuggestionBoxChannelId(guildId: string): string {
        return this._config[ConfigurationService.SUGGESTION_BOX_PROP];
    }

    // Temp - this is only a configuration until it is moved to a db
    public getProposalChannelId(guildId: string): string {
        return this._config[ConfigurationService.PROPOSAL_CHANNEL_PROP];
    }

    private _setupToken(): void {
        if (this._config[ConfigurationService.TOKEN_PROP]) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("Token was set from file override.");
            }
        } else if (process.env[ConfigurationService.VILBOT_API_KEY_ENV]) {
            if (this.log.isDebugEnabled()) {
                this.log.debug("Setting token from environment variable.");
            }
            this._config[ConfigurationService.TOKEN_PROP] = process.env[ConfigurationService.VILBOT_API_KEY_ENV];
        } else {
            if (this.log.isDebugEnabled()) {
                this.log.debug(`No token found in file override or environment variable ${ConfigurationService.VILBOT_API_KEY_ENV}`);
            }
        }
    }

    private _readConfigFromFile(path: string): void {
        if (fs.existsSync(path)) {
            const config = require(path);
            for (let key of ConfigurationService.FILE_OVERRIDE_PROPERTIES) {
                if (config[key]) {
                    if (this.log.isDebugEnabled()) {
                        this.log.debug(`Setting ${key}=${config[key]} from file override`);
                    }
                    this._config[key] = config[key];
                } else if (this.log.isDebugEnabled()) {
                    const val = this._config[key];
                    this.log.debug(`No value for ${key} found in file override - using default value ${val}`);
                }
            }
        } else {
            this.log.info(`Config file was not found - resorting to default values`);
        }
    }
}