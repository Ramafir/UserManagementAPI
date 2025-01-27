import { DataSource } from 'typeorm';
import { User } from '@db/entities/User';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
        const userFactory = factoryManager.get(User);

        await userFactory.save({
            email: 'all-permissions@itvault.com',
            role: 'admin',
        });

        await userFactory.save({
            email: 'no-permissions@itvault.com',
            role: 'user',
        });
    }
}
