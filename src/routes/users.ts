import express from 'express';
import { container } from 'tsyringe';

import { ShowController } from '@controllers/User/ShowController';
import { IndexController } from '@controllers/User/IndexController';
import { StoreController } from '@controllers/User/StoreController';

const router = express.Router();

const showController = container.resolve(ShowController);
const indexController = container.resolve(IndexController);
const storeController = container.resolve(StoreController);

router.get('/users', (req, res) => indexController.handle(req, res));

router.get('/user/:id', (req, res) => showController.handle(req, res));

router.post('/user', (req, res) => storeController.handle(req, res));

export default router;
