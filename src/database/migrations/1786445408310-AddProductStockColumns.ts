import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductStockColumns1786445408310 implements MigrationInterface {
  name = 'AddProductStockColumns1786445408310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`products\`
      ADD COLUMN \`totalStock\` int NOT NULL DEFAULT 0,
      ADD COLUMN \`reservedStock\` int NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`products\`
      DROP COLUMN \`reservedStock\`,
      DROP COLUMN \`totalStock\`
    `);
  }
}
