import { Column, Entity, Index } from 'typeorm';
import { AppBaseEntity } from '@ecommerce/common';
import { ReservationStatus } from '../interfaces/reservation-status.enum';

@Entity('stock_reservations')
export class StockReservationEntity extends AppBaseEntity {
  @Column({ type: 'int' })
  @Index()
  orderId!: number;

  @Column({ type: 'int' })
  productId!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.RESERVED,
  })
  status!: ReservationStatus;
}
