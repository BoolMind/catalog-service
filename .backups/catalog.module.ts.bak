import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';

import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';

import { CategoriesService } from './categories/categories.service';
import { ProductsService } from './products/products.service';

import { CategoriesController } from './categories';
import { ProductsController } from './products';

import { UserGrpcClient } from '../grpc/user.grpc.client';

const contractsPath = require.resolve('@ecommerce/contracts/package.json').replace('/package.json', '');

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),

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

  controllers: [CategoriesController, ProductsController],

  providers: [CategoriesService, ProductsService, UserGrpcClient],

  exports: [CategoriesService, ProductsService],
})
export class CatalogModule {}
