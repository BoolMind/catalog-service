import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { appConfig, databaseConfig, grpcConfig } from './config';

import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';

import {
  HealthModule,
  LoggerModule,
  GrpcLoggingInterceptor,
  GrpcValidationInterceptor,
  GrpcExceptionFilter,
} from '@ecommerce/common';

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

  providers: [
  { provide: APP_INTERCEPTOR, useClass: GrpcLoggingInterceptor },
  { provide: APP_INTERCEPTOR, useClass: GrpcValidationInterceptor },
  { provide: APP_FILTER, useClass: GrpcExceptionFilter },
],
})
export class AppModule {}