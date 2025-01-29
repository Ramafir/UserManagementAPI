import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { Di } from '@enums/Di';
import { UserMapper } from '@mappers/UserMapper';
import { BaseController } from '@controllers/BaseController';
import { IUserRepository } from 'types/repositories/IUserRepository';

@injectable()
export class IndexController extends BaseController {
    constructor(
        @inject(Di.UserRepository)
        private userRepository: IUserRepository
    ) {
        super();
    }

    async handle(request: Request, response: Response) {
        try {
            const { role } = request.query;

            let users;
            
            if (role) {
                users = await this.userRepository.getUsersByRole(role as string);
            } else {
                users = await this.userRepository.getAllUsers();
            }

            const mappedUsers = users.map(user => new UserMapper(user));

            return this.finalizeRequest(response, HTTP.OK, mappedUsers);
        } catch (error) {
            console.error('Error in IndexController:', error);

            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    }
}
