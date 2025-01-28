import { User } from '@db/entities/User';
import { BaseMapper } from './BaseMapper';

export class UserMapper extends BaseMapper<User> {
    id: number;
    email: string;
    fullName: string;
    role: string;

    constructor(data: User) {
        super(data, ['id', 'email', 'role']);

        this.assignInitialKeys();

        this.fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();

        this.role = data.role;
    }
}
