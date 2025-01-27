import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { Di } from '@enums/Di';
import { IUserRepository } from 'types/repositories/IUserRepository';
import { BaseController } from '@controllers/BaseController';

@injectable()
export class DeleteController extends BaseController {
    constructor(
        @inject(Di.UserRepository)
        private userRepository: IUserRepository
    ) {
        super();
    }

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            if (!id || isNaN(Number(id))) {
                return this.finalizeRequest(response, HTTP.BAD_REQUEST, { error: 'Invalid user ID' });
            }

            const user = await this.userRepository.getById(Number(id));

            if (!user) {
                return this.finalizeRequest(response, HTTP.NOT_FOUND, { error: 'User not found' });
            }

            await this.userRepository.hardDeleteEntity(user);

            return this.finalizeRequest(response, HTTP.OK, { message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error in DeleteController:', error);

            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    }
}
