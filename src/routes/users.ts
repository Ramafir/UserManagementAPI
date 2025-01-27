import express from 'express';
import { container } from 'tsyringe';
import { IndexController } from '@controllers/User/IndexController';

const router = express.Router();
const indexController = container.resolve(IndexController);

router.get('/users', (req, res) => indexController.handle(req, res));

export default router;
