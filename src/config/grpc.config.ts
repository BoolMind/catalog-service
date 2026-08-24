import { registerAs } from '@nestjs/config';

export interface GrpcConfig {
  host: string;
  port: number;
  url: string;
}

export const grpcConfig = registerAs('grpc', (): GrpcConfig => {
  const host = process.env.GRPC_HOST ?? 'localhost';
  const port = parseInt(process.env.GRPC_PORT ?? '50051', 10);

  return {
    host,
    port,
    url: `${host}:${port}`,
  };
});

export default grpcConfig;
