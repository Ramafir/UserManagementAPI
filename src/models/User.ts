import {
    Table,
    Model,
    Column,
    Unique,
    Length,
    IsUUID,
    Default,
    DataType,
    AllowNull,
    PrimaryKey
} from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true
})
export class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @IsUUID(4)
    @Column(DataType.UUIDV4)
    id: string;

    @Unique
    @AllowNull(false)
    @Length({ min: 5, max: 100 })
    @Column(DataType.STRING)
    email: string;

    @Length({ min: 2, max: 250 })
    @Column(DataType.STRING)
    firstName: string;

    @Length({ min: 2, max: 250 })
    @Column(DataType.STRING)
    lastName: string;

    @Length({ min: 2, max: 250 })
    @Column(DataType.STRING)
    role: string;
}
