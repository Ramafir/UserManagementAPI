import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { UserMapper } from '@mappers/UserMapper';
import { IUserRepository } from 'types/repositories/IUserRepository';

import { BaseController } from '@controllers/BaseController';
import { Di } from '@enums/Di';

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
            const users = await this.userRepository.getAllUsers();

            const mappedUsers = users.map(user => new UserMapper(user));

            return this.finalizeRequest(response, HTTP.OK, mappedUsers);
        } catch (error) {
            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR);
        }
    }
}
