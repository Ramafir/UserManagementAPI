import { Container } from 'typedi';
import { faker } from '@faker-js/faker';

import { UserRepository } from '@/repositories/UserRepository';

import type { User } from '@/models/User';
import type { IUserFactoryData } from '@/types/factories';

export class UserFactory {
    static generate(props: Partial<IUserFactoryData> = {}, sexType?: 'male' | 'female') {
        sexType = sexType || faker.person.sexType();

        const firstName = faker.person.firstName(sexType);
        const lastName = faker.person.lastName(sexType);

        const role = 'user';
        const email = `${faker.internet.email({ firstName, lastName })}.test`.toLowerCase();

        const defaultProps: IUserFactoryData = {
            lastName,
            firstName,
            email,
            role
        };

        return { ...defaultProps, ...props };
    }

    static async create(props: Partial<IUserFactoryData> = {}, sexType?: 'male' | 'female') {
        const userRepository = Container.get(UserRepository);

        const data: Partial<User> = UserFactory.generate(props, sexType);

        const user = await userRepository.create(data);

        return user;
    }
}
