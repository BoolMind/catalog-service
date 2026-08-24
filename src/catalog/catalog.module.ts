import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';

import { Category } from './categories';
import { Product, StockReservationEntity } from './products';

import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';
import { StockService } from './products/stock.service';

import { CategoriesController } from './categories';
import { ProductsController } from './products';
import { StockConsumerController } from '../messaging/rabbitmq/stock.consumer';

import { UserGrpcClient } from '../grpc/user.grpc.client';

const contractsPath = require
  .resolve('@ecommerce/contracts/package.json')
  .replace('/package.json', '');

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, StockReservationEntity]),

    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,

        options: {
          package: 'ecommerce.user.v1',

          protoPath: resolve(
            contractsPath,
            'proto/ecommerce/user/v1/user.proto',
          ),

          loader: {
            longs: Number,
            includeDirs: [
              resolve(contractsPath, 'proto'),

              `${contractsPath}/dependencies`,
            ],
          },

          url: `${process.env.USER_GRPC_HOST ?? 'localhost'}:${
            process.env.USER_GRPC_PORT ?? 50052
          }`,
        },
      },
    ]),
  ],

  controllers: [
    CategoriesController,
    ProductsController,
    StockConsumerController,
  ],

  providers: [CategoriesService, ProductsService, StockService, UserGrpcClient],

  exports: [CategoriesService, ProductsService, StockService],
})
export class CatalogModule {}
