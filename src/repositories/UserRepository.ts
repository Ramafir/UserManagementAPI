import { Service } from 'typedi';
import { Op, FindOptions } from 'sequelize';

import { User } from '@/models/User';
import { Repository } from './Repository';

@Service()
export class UserRepository extends Repository<User> {
    get model() {
        return User;
    }

    findByEmail(email: string, options: FindOptions = {}) {
        const args = this.deepmerge.all([options, { where: { email } }]);

        return this.repository.findOne(args) as Promise<User | null>;
    }

    findByUsername(username: string, options: FindOptions = {}) {
        const args = this.deepmerge.all([options, { where: { username } }]);

        return this.repository.findOne(args) as Promise<User | null>;
    }

    findByUsernameOrEmail(usernameOrEmail: string, options: FindOptions = {}) {
        const args = this.deepmerge.all([
            options,
            {
                where: {
                    [Op.or]: [
                        { username: usernameOrEmail },
                        { email: usernameOrEmail }
                    ]
                }
            }
        ]);

        return this.repository.findOne(args) as Promise<User | null>;
    }
}
