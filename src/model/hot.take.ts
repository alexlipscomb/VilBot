import { AllowNull, Column, Default, IsUUID, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { MessageAssociatedModel } from './interfaces/message.associated.model';

@Table({ timestamps: true })
export class HotTake extends MessageAssociatedModel {
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @IsUUID(4)
    @Column
    public id: string;

    @AllowNull(false)
    @Column
    public greaterItem: string;

    @AllowNull(false)
    @Column
    public lesserItem: string;

    @AllowNull(false)
    @Default(0)
    @Column
    public agreeCount: number;

    @AllowNull(false)
    @Default(0)
    @Column
    public disagreeCount: number;
}