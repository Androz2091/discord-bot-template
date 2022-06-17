import { Entity, Column, createConnection, PrimaryGeneratedColumn } from "typeorm";

export const initialize = () => createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [User],
    synchronize: process.env.ENVIRONMENT === 'development',
});

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 32
    })
    userId!: string;

    @Column()
    money!: number;
}
