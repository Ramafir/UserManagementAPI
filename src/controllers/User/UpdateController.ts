import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { Di } from '@enums/Di';
import { UserMapper } from '@mappers/UserMapper';
import { BaseController } from '@controllers/BaseController';
import { IUserRepository } from 'types/repositories/IUserRepository';

@injectable()
export class UpdateController extends BaseController {
    constructor(
        @inject(Di.UserRepository)
        private userRepository: IUserRepository
    ) {
        super();
    }

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const { firstName, lastName, role } = request.body;

            const user = await this.userRepository.getById(Number(id));

            if (!user) {
                return this.finalizeRequest(response, HTTP.NOT_FOUND, { error: 'User not found' });
            }

            const updatedFields: Partial<typeof user> = {};
            if (firstName) updatedFields.firstName = firstName;
            if (lastName) updatedFields.lastName = lastName;
            if (role) updatedFields.role = role;

            await this.userRepository.primitiveUpdate({ id: Number(id) }, updatedFields);

            const updatedUser = await this.userRepository.getById(Number(id));

            if (!updatedUser) {
                return this.finalizeRequest(response, HTTP.NOT_FOUND, { error: 'User not found after update' });
            }

            const mappedUser = new UserMapper(updatedUser);

            return this.finalizeRequest(response, HTTP.OK, mappedUser);
        } catch (error) {
            console.error('Error in UpdateController:', error);

            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    }
}
