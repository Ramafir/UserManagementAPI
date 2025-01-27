import express from 'express';
import { container } from 'tsyringe';

import { ShowController } from '@controllers/User/ShowController';
import { IndexController } from '@controllers/User/IndexController';

const router = express.Router();

const indexController = container.resolve(IndexController);
const showController = container.resolve(ShowController);

router.get('/users', (req, res) => indexController.handle(req, res));

router.get('/user/:id', (req, res) => showController.handle(req, res));

export default router;
