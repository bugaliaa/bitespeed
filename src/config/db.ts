import { Pool, PoolConfig } from 'pg';
import { env } from './env';

export const dbConfig: PoolConfig = {
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

export const db = new Pool(dbConfig);

db.on('connect', () => {
    console.log('PostgreSQL database connected');
});

db.on('error', (err) => {
    console.error('PostgreSQL database error:', err);
});
