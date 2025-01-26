import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1688323621217 implements MigrationInterface {
  name = "CreateUsersTable1688323621217";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deletedAt\` datetime(6) NULL,
        \`email\` text NOT NULL,
        \`firstName\` text NULL,
        \`lastName\` text NULL,
        \`role\` text NOT NULL,
        UNIQUE(\`email\`(255)),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
