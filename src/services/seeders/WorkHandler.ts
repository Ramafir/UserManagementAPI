import { Service } from 'typedi';

import { UserFactory } from '@/factories/User';

@Service()
export class SeedersWorkHandler {
    async handle() {
        await UserFactory.create({
            email: 'admin@usermanagement.test',
            firstName: 'admin',
            lastName: 'admin',
            role: 'admin'
        });
    }
}
