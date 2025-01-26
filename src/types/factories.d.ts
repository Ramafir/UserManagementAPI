import type { User } from '@models/User';

export type IProcess = 'API' | 'QUEUES' | 'SCHEDULER' | 'TESTS';

export type IUserFactoryData = Pick<User, 'email' | 'firstName' | 'lastName' | 'role'>;
