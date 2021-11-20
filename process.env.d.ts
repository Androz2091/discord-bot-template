// eslint-disable-next-line no-unused-vars
declare namespace NodeJS {
    export interface ProcessEnv {
        DISCORD_CLIENT_TOKEN: string;

        DB_NAME: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;

        EMBED_COLOR: string;

        ENVIRONMENT: string;
    }
}