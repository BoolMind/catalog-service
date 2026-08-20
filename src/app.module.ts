import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, databaseConfig, grpcConfig } from './config';

import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';

import { HealthModule, LoggerModule } from '@ecommerce/common';

import { envValidationSchema } from './config/env.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, grpcConfig],
      envFilePath: '.env',
      validationSchema: envValidationSchema,
    }),

    LoggerModule,
    DatabaseModule,
    HealthModule,
    CatalogModule,
  ],
})
export class AppModule {}
