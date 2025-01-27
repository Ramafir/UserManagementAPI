import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { StatusCodes as HTTP } from 'http-status-codes';

import { Di } from '@enums/Di';
import { IUserRepository } from 'types/repositories/IUserRepository';
import { BaseController } from '@controllers/BaseController';

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

            if (!id || isNaN(Number(id))) {
                return this.finalizeRequest(response, HTTP.BAD_REQUEST, { error: 'Invalid user ID' });
            }

            if (!firstName && !lastName && !role) {
                return this.finalizeRequest(response, HTTP.BAD_REQUEST, {
                    error: 'Request body must contain at least one property: firstName, lastName, or role',
                });
            }

            if (role && !['user', 'admin'].includes(role)) {
                return this.finalizeRequest(response, HTTP.BAD_REQUEST, {
                    error: 'Role must be either "user" or "admin"',
                });
            }

            const user = await this.userRepository.getById(Number(id));

            if (!user) {
                return this.finalizeRequest(response, HTTP.NOT_FOUND, { error: 'User not found' });
            }

            const updatedFields: Partial<typeof user> = {};
            if (firstName) updatedFields.firstName = firstName;
            if (lastName) updatedFields.lastName = lastName;
            if (role) updatedFields.role = role;

            await this.userRepository.primitiveUpdate({ id: Number(id) }, updatedFields);

            return this.finalizeRequest(response, HTTP.OK, { message: 'User updated successfully' });
        } catch (error) {
            console.error('Error in UpdateController:', error);

            return this.finalizeRequest(response, HTTP.INTERNAL_SERVER_ERROR, {
                error: 'Internal server error',
            });
        }
    }
}
