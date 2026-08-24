# Catalog Service

The Catalog Service manages products, categories, and product stock for the Ecommerce microservices system.

It exposes gRPC APIs for catalog operations and communicates with other services through the shared Protocol Buffer contracts.

## Responsibilities

- Manage products
- Manage product categories
- Manage product stock
- Handle stock reservations
- Validate incoming gRPC requests
- Persist catalog data using TypeORM
- Communicate with the User Service through gRPC
- Publish and consume messaging events related to catalog operations
- Provide centralized exception handling
- Provide logging and distributed tracing
- Provide health monitoring

## Project Structure

```text
catalog-service/
├── src/
│   ├── catalog/
│   │   ├── categories/
│   │   │   ├── entities/
│   │   │   ├── exceptions/
│   │   │   ├── interfaces/
│   │   │   ├── mappers/
│   │   │   ├── categories.controller.ts
│   │   │   └── categories.service.ts
│   │   │
│   │   ├── products/
│   │   │   ├── entities/
│   │   │   ├── exceptions/
│   │   │   ├── interfaces/
│   │   │   ├── mappers/
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── stock.service.ts
│   │   │
│   │   ├── catalog.module.ts
│   │   └── index.ts
│   │
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   ├── data-source.ts
│   │   └── database.module.ts
│   │
│   ├── grpc/
│   │   └── user.grpc.client.ts
│   │
│   ├── messaging/
│   │   └── rabbitmq/
│   │       └── stock.consumer.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

## Products

The Catalog Service provides product management functionality.

Product operations include:

- Create products
- Retrieve products
- Retrieve a product by ID
- Update products
- Delete products
- Restore products
- Paginate products
- Search and filter products
- Manage product stock

Product persistence is handled through TypeORM.

## Categories

The service provides category management functionality.

Category operations include:

- Create categories
- Retrieve categories
- Retrieve a category by ID
- Update categories
- Delete categories
- Restore categories
- Paginate categories

Categories are persisted in the catalog database.

## Stock Management

The Catalog Service manages product inventory and stock reservations.

Stock functionality includes:

- Maintaining available product stock
- Reserving stock
- Releasing reservations
- Confirming stock usage
- Preventing invalid stock operations
- Managing stock reservation records

Stock reservations are persisted separately from product records.

## Database

The service uses TypeORM for database access.

Database configuration is located under:

```text
src/config/
```

Database-related modules and migrations are located under:

```text
src/database/
```

Migrations are used to create and evolve the catalog database schema.

## gRPC Communication

The Catalog Service exposes gRPC endpoints defined by the contracts in `ecommerce-contracts`.

The service also communicates with the User Service through gRPC.

The User Service client is located under:

```text
src/grpc/
```

The service uses the Protocol Buffer definitions provided by `@ecommerce/contracts`.

## Messaging

The Catalog Service uses RabbitMQ for messaging related to stock operations.

Messaging-related code is located under:

```text
src/messaging/
```

Stock-related messages are consumed by the catalog service to coordinate inventory operations with other parts of the system.

## Validation

Incoming gRPC requests are validated through the shared validation infrastructure.

The service uses the shared gRPC validation interceptor and contract-level validation.

Validation-related behavior is applied through:

- gRPC validation interceptors
- Protocol Buffer validation
- Service-level validation
- Domain-specific exceptions

## Error Handling

The service uses centralized gRPC exception handling provided by `@ecommerce/common`.

Domain-specific catalog exceptions are located under:

```text
src/catalog/categories/exceptions/
src/catalog/products/exceptions/
```

These exceptions cover cases such as:

- Category not found
- Category already exists
- Product not found
- Product already exists
- Invalid stock operations

## Health Checks

The service includes the shared health module provided by `@ecommerce/common`.

Health functionality is used to monitor the availability of the service and its required infrastructure.

## Logging

The Catalog Service uses the shared application logger provided by `@ecommerce/common`.

Logging is configured during application bootstrap and is available throughout the service.

## Tracing

Distributed tracing is initialized during application startup.

The service name is configured through the `SERVICE_NAME` environment variable.

## Configuration

Configuration is handled through NestJS `ConfigModule`.

Configuration files are located under:

```text
src/config/
```

The service configuration includes:

- Application configuration
- Database configuration
- gRPC configuration
- Environment validation

Create a local `.env` file using `.env.example` as a reference.

Do not commit secrets or actual environment values.

## Installation

Install dependencies:

```bash
npm install
```

## Development

Start the service in development mode:

```bash
npm run start:dev
```

## Build

Build the application:

```bash
npm run build
```

## Production

Start the compiled application:

```bash
npm run start:prod
```

## Type Checking

Run TypeScript type checking without emitting files:

```bash
npx tsc --noEmit
```

## Formatting

Format the source code using Prettier:

```bash
npx prettier --write src
```

## Docker

The service includes Docker configuration for running the application and its required infrastructure.

Build the Docker image:

```bash
docker build -t catalog-service .
```

The repository also contains a Docker Compose configuration:

```text
docker-compose.yml
```

## Environment

Use `.env.example` as the reference for local environment configuration.

Actual `.env` files and secrets should remain local and are excluded through `.gitignore`.

## Shared Components

### `@ecommerce/common`

Provides shared infrastructure and reusable functionality across the microservices system, including:

- Logging
- Exception handling
- gRPC utilities
- Health checks
- Interceptors
- Messaging utilities
- Distributed tracing
- Shared DTOs and interfaces

### `@ecommerce/contracts`

Provides the Protocol Buffer contracts used for gRPC communication between services.

The Catalog Service uses these contracts for its gRPC API and communication with other microservices.