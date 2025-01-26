import { DataSource } from "typeorm";
import { User } from "@db/entities/User";
import { Seeder } from "typeorm-extension";
import { faker } from "@faker-js/faker";

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Create admin user
    await userRepository.save({
      email: "admin@example.com",
      firstName: "Jan",
      lastName: "Kowalski",
      role: "admin"
    });

    // Create 3 regular users
    for (let i = 0; i < 3; i++) {
      await userRepository.save({
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        role: "user"
      });
    }
  }
}
