import { injectable } from 'tsyringe';
import { User } from '@db/entities/User';
import { IUserRepository } from 'types/repositories/IUserRepository';

import { BaseRepository } from './BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(User);
    }

    getAllUsers(): Promise<User[]> {
        return this.getAll({
            order: {
                createdAt: 'DESC', // Sortowanie po dacie utworzenia
            },
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
