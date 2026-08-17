import { registerAs } from '@nestjs/config';

export interface GrpcConfig {
  host: string;
  port: number;
}

export const grpcConfig = registerAs(
  'grpc',
  (): GrpcConfig => ({
    host: process.env.GRPC_HOST ?? 'localhost',
    port: parseInt(process.env.GRPC_PORT ?? '50051', 10),
  }),
);

export default grpcConfig;