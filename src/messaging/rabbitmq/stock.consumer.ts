import {
  Controller,
  Logger,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  RpcExceptionFilter,
  STOCK_RELEASE_QUEUE,
  STOCK_RESERVE_QUEUE,
  TracingInterceptor,
} from '@ecommerce/common';
import { StockService } from '../../catalog/products/stock.service';
import {
  StockReleaseRequest,
  StockReserveRequest,
  StockReserveResult,
} from '../../catalog/products/interfaces';

@Controller()
@UseFilters(RpcExceptionFilter)
@UseInterceptors(TracingInterceptor)
export class StockConsumerController {
  private readonly logger = new Logger(StockConsumerController.name);

  constructor(private readonly stockService: StockService) {}

  @MessagePattern(STOCK_RESERVE_QUEUE)
  async reserveStock(
    @Payload() data: StockReserveRequest,
    @Ctx() context: RmqContext,
  ): Promise<StockReserveResult> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.assertReserveRequest(data);
      this.logger.log(
        `stock.reserve for order ${data.orderId}: ${JSON.stringify(data.items)}`,
      );
      const result = await this.stockService.reserve(data.orderId, data.items);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      const orderId = data?.orderId ?? 'unknown';
      this.logger.error(
        `stock.reserve infrastructure failure for order ${orderId}: ${(error as Error).message}`,
      );
      channel.nack(originalMsg, false, false);
      throw error;
    }
  }

  @EventPattern(STOCK_RELEASE_QUEUE)
  async releaseStock(
    @Payload() data: StockReleaseRequest,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.assertReleaseRequest(data);
      this.logger.log(`stock.release for order ${data.orderId}`);
      await this.stockService.release(data.orderId);
      channel.ack(originalMsg);
    } catch (error) {
      const orderId = data?.orderId ?? 'unknown';
      this.logger.error(
        `stock.release infrastructure failure for order ${orderId}: ${(error as Error).message}`,
      );
      channel.nack(originalMsg, false, false);
    }
  }

  private assertReserveRequest(data: StockReserveRequest): void {
    if (
      !data ||
      !Number.isInteger(data.orderId) ||
      data.orderId <= 0 ||
      !Array.isArray(data.items) ||
      data.items.some(
        (item) =>
          !item ||
          !Number.isInteger(item.productId) ||
          item.productId <= 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0,
      )
    ) {
      throw new Error('INVALID_STOCK_RESERVE_PAYLOAD');
    }
  }

  private assertReleaseRequest(data: StockReleaseRequest): void {
    if (!data || !Number.isInteger(data.orderId) || data.orderId <= 0) {
      throw new Error('INVALID_STOCK_RELEASE_PAYLOAD');
    }
  }
}
