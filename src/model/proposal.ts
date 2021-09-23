import { AllowNull, Column, Default, IsUUID, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { GuildAssociatedModel } from './interfaces/guild.associated.model';
import { MessageAssociatedModel } from './interfaces/message.associated.model';
import { UserAssociatedModel } from './interfaces/user.associated.model';

@Table({ timestamps: true })
export class Proposal extends MessageAssociatedModel {
    @PrimaryKey
    @Unique
    @AllowNull
    @IsUUID(4)
    @Column
    public id: string;

    @AllowNull(false)
    @Column
    public proposal: string;

    @AllowNull(false)
    @Column
    public userId: string;

    @AllowNull(false)
    @Default(0)
    @Column
    public agreeCount: number;

    @AllowNull(false)
    @Default(0)
    @Column
    public disagreeCount: number;
}

@Table({ timestamps: true })
export class GuildSettings extends GuildAssociatedModel {
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @Column
    public id: string

    @AllowNull(false)
    @Default('majority')
    @Column
    public passConditionMode: string;

    @AllowNull(false)
    @Default(0)
    @Column
    public votesToPass: number;

    @AllowNull(true)
    @Column
    public channelId: string;

    @AllowNull(false)
    @Default(':arrow_up:')
    @Column
    public agreeEmoji: string

    @AllowNull(false)
    @Default(':arrow_down:')
    @Column
    public disagreeEmoji: string

    @AllowNull(true)
    @Column
    public proposalRole: string
}

@Table({ timestamps: true })
export class Users extends UserAssociatedModel {
    // TODO
}