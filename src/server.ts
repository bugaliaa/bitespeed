import app from './app';
import { db } from './config/db';
import { env } from './config/env';

const startServer = async () => {
    try {
        await db.connect();

        app.listen(env.APP_PORT, () => {
            console.log(`Server is running on port ${env.APP_PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();
