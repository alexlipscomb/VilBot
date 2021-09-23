import { Column, Model } from 'sequelize-typescript';

export type MessageMeta = { messageId: string, channelId: string, guildId: string };

export class MessageAssociatedModel extends Model {
    @Column
    public guildId: string;

    @Column
    public channelId: string;

    @Column
    public messageId: string;
}