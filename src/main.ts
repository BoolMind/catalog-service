import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AppLogger } from '@ecommerce/common';
import { GrpcExceptionFilter } from '@ecommerce/common';

const contractsPath = require.resolve('@ecommerce/contracts/package.json')
  .replace('/package.json', '');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,

    options: {
      package: [
        'ecommerce.catalog.v1',
        'ecommerce.common.v1',
      ],

      protoPath: [
        `${contractsPath}/proto/ecommerce/catalog/v1/catalog.proto`,
        `${contractsPath}/proto/ecommerce/common/v1/health.proto`,
      ],

      loader: {
        includeDirs: [
          `${contractsPath}/proto`,
          `${contractsPath}/dependencies`,
        ],
      },

      url: `${process.env.GRPC_HOST ?? '0.0.0.0'}:${
        process.env.GRPC_PORT ?? 50051
      }`,
    },
  });

  app.useLogger(app.get(AppLogger));
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();

  console.log(
    `🚀 Catalog gRPC service running on ${
      process.env.GRPC_PORT ?? 50051
    }`,
  );
}

bootstrap();
