import { VilbotUtil } from "../util/vilbot.util";

export enum LogLevel {
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    FATAL = 0
}

// TODO make log levels changeable at runtime
export class Logger {
    private static _levels: Map<string, LogLevel> = new Map();
    private static _instances: Map<string, Logger> = new Map();
    private static _isInitialized: boolean = false;

    public static getLogger(tag: string): Logger {
        if (!Logger._instances.has(tag)) {
            const service: Logger = new Logger(tag);
            Logger._instances.set(tag, service);
        }
        return Logger._instances.get(tag);
    }

    public isDebugEnabled(): boolean {
        return Logger._isDebugEnabled(this._tag);
    }

    public getLogLevel(): LogLevel {
        return Logger._getLogLevel(this._tag);
    }

    public debug(...args: any): void {
        Logger._logToConsole(LogLevel.DEBUG, this._tag, args);
    }

    public info(...args: any): void {
        Logger._logToConsole(LogLevel.INFO, this._tag, args);
    }

    public warn(...args: any): void {
        Logger._logToConsole(LogLevel.WARN, this._tag, args);
    }

    public error(...args: any): void {
        Logger._logToConsole(LogLevel.ERROR, this._tag, args);
    }

    public fatal(...args: any): void {
        Logger._logToConsole(LogLevel.FATAL, this._tag, args);
    }

    // Helpers/biz
    public static readonly DEBUG_COLOR: string = "\x1b[36m"; // cyan
    public static readonly INFO_COLOR: string = "\x1b[34m"; // blue
    public static readonly WARN_COLOR: string = "\x1b[33m"; // yellow
    public static readonly ERROR_COLOR: string = "\x1b[31m"; // red
    public static readonly FATAL_COLOR: string = "\x1b[37m"; // white

    private constructor(
        private _tag: string
    ) { }

    private static _initialize(): void {
        // TODO this relative path will almost certainly give us a headache later
        const logConfig = require('./../logconfig.json');
        for (let [tag, value] of Object.entries(logConfig)) {
            if (typeof value === 'string') {
                const level: LogLevel = Logger._parseLogLevel(value);
                if (level) {
                    this._levels.set(tag, level);
                }
            }
        }

        Logger._isInitialized = true;
    }

    protected static _isDebugEnabled(tag: string): boolean {
        if (!Logger._isInitialized) {
            Logger._initialize();
        }

        return Logger._getLogLevel(tag) == LogLevel.DEBUG;
    }

    protected static _getLogLevel(tag: string): LogLevel {
        if (!Logger._isInitialized) {
            Logger._initialize();
        }

        if (Logger._levels.has(tag)) {
            return Logger._levels.get(tag);
        }
        return LogLevel.INFO; // default level
    }

    protected static _logToConsole(level: LogLevel, tag: string, args: any) {
        if (!Logger._isInitialized) {
            Logger._initialize();
        }

        if (Logger._getLogLevel(tag) >= level) {
            const datestr: string = ` - ${VilbotUtil.getTimestamp()} (UTC ${VilbotUtil.getUTCTimeStamp()})`;
            let color: string = '';
            switch (level) {
                case LogLevel.FATAL:
                    color = Logger.FATAL_COLOR;
                case LogLevel.ERROR:
                    color = Logger.ERROR_COLOR;
                    console.error(color + `[${LogLevel[level]}]` + datestr + ':', args);
                    break;
                case LogLevel.WARN:
                    color = Logger.WARN_COLOR;
                    console.warn(color + `[${LogLevel[level]}]` + datestr + ':', args);
                    break;
                case LogLevel.INFO:
                    color = Logger.INFO_COLOR;
                    console.info(color + `[${LogLevel[level]}]` + datestr + ':', args);
                    break;
                case LogLevel.DEBUG:
                    color = Logger.DEBUG_COLOR;
                default:
                    console.log(color + `[${LogLevel[level]}]` + datestr + ':', args);
            }
        }
    }

    private static _parseLogLevel(level: string): LogLevel {
        if (level) {
            const lowerLevel: string = level.trim().toLowerCase();
            switch (level) {
                case 'debug':
                    return LogLevel.DEBUG;
                case 'info':
                    return LogLevel.INFO;
                case 'warn':
                    return LogLevel.WARN;
                case 'error':
                    return LogLevel.ERROR;
                case 'fatal':
                    return LogLevel.FATAL;
            }
        }
        return null;
    }
}