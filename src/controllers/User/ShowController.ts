import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { Di } from '@enums/Di';
import { BaseController } from '@controllers/BaseController';
import { IUserRepository } from 'types/repositories/IUserRepository';

@injectable()
export class ShowController extends BaseController {
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

            const userResponse = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            };

            return this.finalizeRequest(response, HTTP.OK, userResponse);
        } catch (error) {
            console.error('Error in ShowController:', error);
            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR, { error: 'Internal server error' });
        }
    }
}
