import { container } from 'tsyringe';
import { Router, Request, Response } from 'express';

import { authenticate } from '@middleware/authMiddleware';
import { validateRequest } from '@middleware/validateRequest';
import { storeUserValidation, updateUserValidation } from 'validators/usersValidators';
import { ShowController } from '@controllers/User/ShowController';
import { IndexController } from '@controllers/User/IndexController';
import { StoreController } from '@controllers/User/StoreController';
import { UpdateController } from '@controllers/User/UpdateController';
import { DeleteController } from '@controllers/User/DeleteController';

const router: Router = Router();

const showController = container.resolve(ShowController);
const indexController = container.resolve(IndexController);
const storeController = container.resolve(StoreController);
const updateController = container.resolve(UpdateController);
const deleteController = container.resolve(DeleteController);

router.get('/', authenticate, (request: Request, response: Response) => indexController.handle(request, response));

router.get('/:id', authenticate, (request: Request, response: Response) => showController.handle(request, response));

router.post('/', authenticate, storeUserValidation, validateRequest, (request: Request, response: Response) => {
    storeController.handle(request, response);
});

router.patch('/:id', authenticate, updateUserValidation, validateRequest, (request: Request, response: Response) =>
    updateController.handle(request, response)
);

router.delete('/:id', authenticate, (request: Request, response: Response) =>
    deleteController.handle(request, response)
);

export default router;
