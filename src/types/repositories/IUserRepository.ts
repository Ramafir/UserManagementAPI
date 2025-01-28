import { User } from '@db/entities/User';
import { IBaseRepository } from './IBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;

    getUsersByRole(role: string): Promise<User[]>;

    getAllUsers(): Promise<User[]>;
}
