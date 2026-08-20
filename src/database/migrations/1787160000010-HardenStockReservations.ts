import { MigrationInterface, QueryRunner } from 'typeorm';

export class HardenStockReservations1787160000010 implements MigrationInterface {
  name = 'HardenStockReservations1787160000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `stock_reservations` ADD `unitPrice` decimal(10,2) NOT NULL DEFAULT 0',
    );
    await queryRunner.query(
      'ALTER TABLE `stock_reservations` ADD UNIQUE INDEX `UQ_stock_reservations_order_product` (`orderId`, `productId`)',
    );
    await queryRunner.query(
      'ALTER TABLE `products` MODIFY `name` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `categories` MODIFY `name` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `stock_reservations` DROP INDEX `UQ_stock_reservations_order_product`',
    );
    await queryRunner.query(
      'ALTER TABLE `stock_reservations` DROP COLUMN `unitPrice`',
    );
    await queryRunner.query(
      'ALTER TABLE `products` MODIFY `name` varchar(150) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `categories` MODIFY `name` varchar(100) NOT NULL',
    );
  }
}