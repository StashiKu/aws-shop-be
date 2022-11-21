import { ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

export const getDbConfig = (): ClientConfig => ({
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DB,
    connectionTimeoutMillis: 7000,
    ssl: {
        rejectUnauthorized: false
    }
});