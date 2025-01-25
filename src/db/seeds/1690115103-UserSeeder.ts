import { DataSource } from 'typeorm';
import { User } from '@db/entities/User';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ) {
        const userFactory = factoryManager.get(User);

        await userFactory.save({
            email: 'admin@usermanagement.test',
            role: 'admin'
        });

        await userFactory.saveMany(3, {
            role: 'user',
            deletedAt: new Date()
        });
    }
}
