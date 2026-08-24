import 'dotenv/config';

import { initTracing, AppLogger, GrpcExceptionFilter } from '@ecommerce/common';
initTracing(process.env.SERVICE_NAME ?? 'catalog-service');

import { NestFactory } from '@nestjs/core';
import { GrpcOptions, RmqOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

import {
  buildRabbitMqClientOptions,
  getRabbitMqUrlsFromEnv,
  STOCK_RELEASE_QUEUE,
  STOCK_RESERVE_QUEUE,
} from '@ecommerce/common';

const contractsPath = require
  .resolve('@ecommerce/contracts/package.json')
  .replace('/package.json', '');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

const grpcMicroservice = app.connectMicroservice<GrpcOptions>(
  {
    transport: Transport.GRPC,
    options: {
      package: ['ecommerce.catalog.v1', 'ecommerce.common.v1'],
      protoPath: [
        `${contractsPath}/proto/ecommerce/catalog/v1/catalog.proto`,
        `${contractsPath}/proto/ecommerce/common/v1/health.proto`,
      ],
      loader: {
        longs: Number,
        includeDirs: [
          `${contractsPath}/proto`,
          `${contractsPath}/dependencies`,
        ],
      },
      url: `${process.env.GRPC_HOST ?? '0.0.0.0'}:${process.env.GRPC_PORT ?? 50051}`,
    },
  },
  {
    inheritAppConfig: true,
  },
);

grpcMicroservice.useGlobalFilters(new GrpcExceptionFilter());
  const rabbitUrls = getRabbitMqUrlsFromEnv();

  app.connectMicroservice<RmqOptions>(
    buildRabbitMqClientOptions({
      urls: rabbitUrls,
      queue: STOCK_RESERVE_QUEUE,
    }),
  );

  app.connectMicroservice<RmqOptions>(
    buildRabbitMqClientOptions({
      urls: rabbitUrls,
      queue: STOCK_RELEASE_QUEUE,
    }),
  );

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  await app.startAllMicroservices();

  logger.log('Catalog Service running');
  logger.log(
    `gRPC: ${process.env.GRPC_HOST ?? '0.0.0.0'}:${process.env.GRPC_PORT ?? 50051}; ` +
      'RabbitMQ: stock.reserve, stock.release',
  );
}

bootstrap();