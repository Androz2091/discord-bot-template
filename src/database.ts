import { Entity, Column, DataSource, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import express from 'express';
import { Database, Resource } from '@adminjs/typeorm';
import { validate } from 'class-validator';

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';

Resource.validate = validate;
AdminJS.registerAdapter({ Database, Resource });

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 32
    })
    userId!: string;
    
    @Column()
    money!: number;

}

export const Postgres = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [User],
    synchronize: process.env.ENVIRONMENT === 'development',
});

export const initialize = () => Postgres.initialize().then(() => {
    if (process.env.ADMINJS_PORT) {
        const app = express();
        const admin = new AdminJS({
            branding: {
                
            },
            resources: [User],
        })
        const router = AdminJSExpress.buildRouter(admin)
        app.use(admin.options.rootPath, router)
        app.listen(process.env.ADMINJS_PORT, () => {
            console.log(`AdminJS is listening at http://localhost:${process.env.ADMINJS_PORT}`)
        });
    }
    
});
