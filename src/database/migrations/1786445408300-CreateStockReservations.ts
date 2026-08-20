import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStockReservations1786445408300
  implements MigrationInterface
{
  name = 'CreateStockReservations1786445408300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`stock_reservations\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        \`orderId\` int NOT NULL,
        \`productId\` int NOT NULL,
        \`quantity\` int NOT NULL,
        \`status\` enum ('RESERVED', 'RELEASED', 'COMMITTED') NOT NULL DEFAULT 'RESERVED',
        INDEX \`IDX_stock_reservations_orderId\` (\`orderId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE \`stock_reservations\`
    `);
  }
}
