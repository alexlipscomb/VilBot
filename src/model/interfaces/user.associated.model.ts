import { Column, Model } from 'sequelize-typescript';

export type UserMeta = { userId: string };

export class UserAssociatedModel extends Model {
    @Column
    public userId: string;
}