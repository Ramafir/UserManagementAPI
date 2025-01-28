import { injectable } from 'tsyringe';

import { User } from '@db/entities/User';
import { BaseRepository } from '@repositories/BaseRepository';
import { IUserRepository } from 'types/repositories/IUserRepository';

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(User);
    }

    getAllUsers(): Promise<User[]> {
        return this.getAll({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    getUsersByRole(role: string): Promise<User[]> {
        return this.getAll({
            where: { role },
        });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.getOne({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });
    }
}
