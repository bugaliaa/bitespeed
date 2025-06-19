import express from 'express';
import { db } from './config/db';

const app = express();

app.use(express.json());

export default app;
