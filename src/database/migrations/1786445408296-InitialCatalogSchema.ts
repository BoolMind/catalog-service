import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCatalogSchema1786445408296 implements MigrationInterface {
    name = 'InitialCatalogSchema1786445408296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(150) NOT NULL, \`description\` text NULL, \`price\` decimal(10,2) NOT NULL, \`userId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), INDEX \`IDX_99d90c2a483d79f3b627fb1d5e\` (\`userId\`), INDEX \`IDX_ff56834e735fa78a15d0cf2192\` (\`categoryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``);
        await queryRunner.query(`DROP INDEX \`IDX_ff56834e735fa78a15d0cf2192\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_99d90c2a483d79f3b627fb1d5e\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}
