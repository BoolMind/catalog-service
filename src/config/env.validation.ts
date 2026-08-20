import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  SERVICE_NAME: Joi.string().required(),

  PORT: Joi.number().port().default(3001),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),

  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),

  GRPC_HOST: Joi.string().required(),
  GRPC_PORT: Joi.number().port().default(50051),

  RABBITMQ_URL: Joi.string().uri({ scheme: ['amqp', 'amqps'] }).required(),
  USER_GRPC_HOST: Joi.string().required(),
  USER_GRPC_PORT: Joi.number().port().required(),
});