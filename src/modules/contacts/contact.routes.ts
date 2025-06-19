import { Router } from 'express';
import { ContactController } from './contact.controller';

const router = Router();
const contactController = new ContactController();

router.post('/', (req, res) => {
    contactController.identify(req, res);
});

export default router;
