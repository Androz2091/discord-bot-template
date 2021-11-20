import { Entity, Column, createConnection, Connection, PrimaryGeneratedColumn } from "typeorm";

export let connection: Connection;

export const initialize = () => createConnection({
    type: 'postgres',
    host: 'localhost',
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [User],
    synchronize: process.env.ENVIRONMENT === 'development',
}).then((createdConnection) => connection = createdConnection);

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
