import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { Di } from '@enums/Di';
import { User } from '@db/entities/User';
import { UserMapper } from '@mappers/UserMapper';
import { IUserRepository } from 'types/repositories/IUserRepository';
import { BaseController } from '@controllers/BaseController';

@injectable()
export class StoreController extends BaseController {
    constructor(
        @inject(Di.UserRepository)
        private userRepository: IUserRepository
    ) {
        super();
    }

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { firstName, lastName, email, role } = request.body;

            const existingUser = await this.userRepository.findByEmail(email);

            if (existingUser) {
                return this.finalizeRequest(response, HTTP.BAD_REQUEST, {
                    error: 'Email address is already taken',
                });
            }

            const user = this.userRepository.createEntity({
                firstName,
                lastName,
                email,
                role,
            } as User);

            const savedUser = await this.userRepository.primitiveSave(user);

            const mappedUser = new UserMapper(savedUser);

            return this.finalizeRequest(response, HTTP.CREATED, mappedUser);
        } catch (error) {
            console.error('Error in StoreController:', error);

            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    }
}
