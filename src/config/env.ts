import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    DB_USER: z.string(),
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.string().transform(Number),
    APP_PORT: z.string().transform(Number),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;
