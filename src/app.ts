import { errorHandler } from '@shared/errors/errorHandler';
import express, { NextFunction, Request, Response } from 'express';
import router from '@modules/contacts/contact.routes';

const app = express();

app.use(express.json());

app.use('/identify', router);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
