import { ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD } = process.env;

export const configureDb = (): ClientConfig => ({
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USER,
    password: PG_PASSWORD,
    connectionTimeoutMillis: 7000
});
