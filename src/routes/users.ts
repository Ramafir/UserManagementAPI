import express from 'express';
import { container } from 'tsyringe';

import { ShowController } from '@controllers/User/ShowController';
import { IndexController } from '@controllers/User/IndexController';
import { StoreController } from '@controllers/User/StoreController';
import { UpdateController } from '@controllers/User/UpdateController';

const router = express.Router();

const showController = container.resolve(ShowController);
const indexController = container.resolve(IndexController);
const storeController = container.resolve(StoreController);
const updateController = container.resolve(UpdateController);

router.get('/users', (req, res) => indexController.handle(req, res));

router.get('/user/:id', (req, res) => showController.handle(req, res));

router.post('/user', (req, res) => storeController.handle(req, res));

router.patch('/user/:id', (req, res) => updateController.handle(req, res));

export default router;
