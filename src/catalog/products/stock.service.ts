import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { StockReservationEntity } from './entities/stock-reservation.entity';
import { ReservationStatus } from './interfaces/reservation-status.enum';
import {
  StockReserveItem,
  StockReserveResult,
  StockReservedItemPrice,
} from './interfaces';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(private readonly dataSource: DataSource) {}

  
  async reserve(
    orderId: number,
    items: StockReserveItem[],
  ): Promise<StockReserveResult> {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return {
        success: false,
        reason: 'INVALID_ORDER_ID',
      };
    }

    if (!Array.isArray(items) || items.length === 0) {
      return {
        success: false,
        reason: 'NO_ITEMS',
      };
    }

    
    const normalizedItems = new Map<number, number>();

    for (const item of items) {
      if (
        !Number.isInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return {
          success: false,
          reason: 'INVALID_ITEM',
        };
      }

      const currentQuantity = normalizedItems.get(item.productId) ?? 0;
      const newQuantity = currentQuantity + item.quantity;

      if (!Number.isSafeInteger(newQuantity)) {
        return {
          success: false,
          reason: `INVALID_QUANTITY:${item.productId}`,
        };
      }

      normalizedItems.set(item.productId, newQuantity);
    }

    const sortedItems: StockReserveItem[] = Array.from(
      normalizedItems.entries(),
    )
      .map(([productId, quantity]) => ({
        productId,
        quantity,
      }))
      .sort((a, b) => a.productId - b.productId);

    try {
      return await this.dataSource.transaction(async (manager) => {
      const reservationRepo = manager.getRepository(StockReservationEntity);
      const productRepo = manager.getRepository(Product);

      
      const existing = await reservationRepo.find({
        where: { orderId },
      });

      if (existing.length > 0) {
        const anyStillReserved = existing.some(
          (reservation) =>
            reservation.status === ReservationStatus.RESERVED,
        );

        this.logger.warn(
          `Duplicate stock.reserve for order ${orderId} -- returning recorded outcome`,
        );

        if (!anyStillReserved) {
          return { success: false };
        }

        const reservedProducts = await productRepo.findByIds(
          existing.map((r) => r.productId),
        );
        const priceById = new Map(reservedProducts.map((p) => [p.id, p]));

        return {
          success: true,
          items: existing
            .filter((r) => r.status === ReservationStatus.RESERVED)
            .map((r) => ({
              productId: r.productId,
              quantity: r.quantity,
              unitPrice: r.unitPrice,
            })),
        };
      }

      const lockedProducts = new Map<number, Product>();

      
      for (const item of sortedItems) {
        const product = await productRepo.findOne({
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          return {
            success: false,
            reason: `PRODUCT_NOT_FOUND:${item.productId}`,
          };
        }

        if (product.availableStock < item.quantity) {
          return {
            success: false,
            reason: `INSUFFICIENT_STOCK:${item.productId}`,
          };
        }

        lockedProducts.set(item.productId, product);
      }

      
      const reservedItems: StockReservedItemPrice[] = [];

      for (const item of sortedItems) {
        const product = lockedProducts.get(item.productId)!;

        product.reservedStock += item.quantity;

        await productRepo.save(product);

        const reservation = reservationRepo.create({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(product.price).toFixed(2),
          status: ReservationStatus.RESERVED,
        });

        await reservationRepo.save(reservation);

        reservedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(product.price).toFixed(2),
        });
      }

      return {
        success: true,
        items: reservedItems,
      };
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        return this.reserve(orderId, items);
      }

      throw error;
    }
  }

  
  async release(orderId: number): Promise<void> {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      throw new Error('INVALID_ORDER_ID');
    }

    await this.dataSource.transaction(async (manager) => {
      const reservationRepo = manager.getRepository(StockReservationEntity);
      const productRepo = manager.getRepository(Product);

      
      const reservations = await reservationRepo.find({
        where: {
          orderId,
          status: ReservationStatus.RESERVED,
        },
        order: {
          productId: 'ASC',
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (reservations.length === 0) {
        this.logger.warn(
          `stock.release for order ${orderId}: no active reservations found (already released or never reserved)`,
        );
        return;
      }

      
      for (const reservation of reservations) {
        const product = await productRepo.findOne({
          where: {
            id: reservation.productId,
          },
          lock: {
            mode: 'pessimistic_write',
          },
        });

        if (!product) {
          
          throw new Error(
            `PRODUCT_NOT_FOUND_DURING_RELEASE:${reservation.productId}`,
          );
        }

        if (product.reservedStock < reservation.quantity) {
          
          throw new Error(
            `RESERVED_STOCK_INCONSISTENCY:${reservation.productId}`,
          );
        }

        product.reservedStock -= reservation.quantity;

        await productRepo.save(product);

        reservation.status = ReservationStatus.RELEASED;

        await reservationRepo.save(reservation);
      }
    });
  }
}
