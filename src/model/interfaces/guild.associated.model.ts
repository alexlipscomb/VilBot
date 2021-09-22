import { Column, Model } from 'sequelize-typescript';

export type GuildMeta = { guildId: string };

export class GuildAssociatedModel extends Model {
    @Column
    public guildId: string;
}