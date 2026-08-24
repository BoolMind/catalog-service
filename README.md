# Catalog Service

The Catalog Service manages products, categories, product stock, and stock reservations for the Ecommerce microservices system.

It exposes gRPC APIs through the shared Protocol Buffer contracts and communicates with other services through gRPC and RabbitMQ.

## Responsibilities

- Create, retrieve, update, and delete products
- Restore products
- Search, filter, and paginate products
- Create, retrieve, update, and delete categories
- Restore categories
- Manage product stock
- Manage stock reservations
- Consume stock-related messages through RabbitMQ
- Communicate with the User Service through gRPC
- Validate incoming gRPC requests
- Persist catalog data using TypeORM
- Manage database schema through migrations
- Handle product and category domain errors
- Provide logging and distributed tracing
- Provide health monitoring

## Project Structure

```text
catalog-service/
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── src/
│   ├── app.module.ts
│   │
│   ├── catalog/
│   │   ├── catalog.module.ts
│   │   ├── index.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── category.entity.ts
│   │   │   │   └── index.ts
│   │   │   ├── exceptions/
│   │   │   │   ├── category.error-code.enum.ts
│   │   │   │   ├── category-exists.exception.ts
│   │   │   │   ├── category-not-found.exception.ts
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── category-service.interface.ts
│   │   │   │   └── index.ts
│   │   │   └── mappers/
│   │   │       ├── categories.mapper.ts
│   │   │       └── index.ts
│   │   │
│   │   └── products/
│   │       ├── entities/
│   │       │   ├── index.ts
│   │       │   ├── product.entity.ts
│   │       │   └── stock-reservation.entity.ts
│   │       ├── exceptions/
│   │       │   ├── index.ts
│   │       │   ├── product-already-exists.exception.ts
│   │       │   ├── product-error-code.enum.ts
│   │       │   └── product-not-found.exception.ts
│   │       ├── index.ts
│   │       ├── interfaces/
│   │       │   ├── index.ts
│   │       │   ├── product-service.interface.ts
│   │       │   ├── reservation-status.enum.ts
│   │       │   └── stock.interface.ts
│   │       ├── mappers/
│   │       │   ├── index.ts
│   │       │   └── products.mapper.ts
│   │       ├── products.controller.ts
│   │       ├── products.service.ts
│   │       └── stock.service.ts
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── env.validation.ts
│   │   ├── grpc.config.ts
│   │   └── index.ts
│   │
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── data-source.ts
│   │   ├── index.ts
│   │   └── migrations/
│   │       ├── 1786445408296-InitialCatalogSchema.ts
│   │       ├── 1786445408300-CreateStockReservations.ts
│   │       ├── 1786445408310-AddProductStockColumns.ts
│   │       └── 1787160000010-HardenStockReservations.ts
│   │
│   ├── grpc/
│   │   └── user.grpc.client.ts
│   │
│   ├── main.ts
│   │
│   └── messaging/
│       └── rabbitmq/
│           └── stock.consumer.ts
│
├── tsconfig.build.json
└── tsconfig.json
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
- Search products
- Filter products
- Manage product stock

Product business logic is implemented in:

```text
src/catalog/products/products.service.ts
```

The product gRPC endpoints are implemented in:

```text
src/catalog/products/products.controller.ts
```

Product persistence is handled through:

```text
src/catalog/products/entities/product.entity.ts
```

## Categories

The Catalog Service provides category management functionality.

Category operations include:

- Create categories
- Retrieve categories
- Retrieve a category by ID
- Update categories
- Delete categories
- Restore categories
- Paginate categories

Category business logic is implemented in:

```text
src/catalog/categories/categories.service.ts
```

The category gRPC endpoints are implemented in:

```text
src/catalog/categories/categories.controller.ts
```

Category persistence is handled through:

```text
src/catalog/categories/entities/category.entity.ts
```

## Stock Management

The Catalog Service manages product inventory and stock reservations.

Stock functionality includes:

- Managing available product stock
- Reserving stock
- Managing stock reservations
- Tracking reservation status
- Handling stock-related operations

Stock business logic is implemented in:

```text
src/catalog/products/stock.service.ts
```

Stock reservation persistence is handled through:

```text
src/catalog/products/entities/stock-reservation.entity.ts
```

Reservation states are defined in:

```text
src/catalog/products/interfaces/reservation-status.enum.ts
```

## RabbitMQ Messaging

The Catalog Service uses RabbitMQ for stock-related messaging.

RabbitMQ integration is located under:

```text
src/messaging/rabbitmq/
```

The stock consumer is implemented in:

```text
src/messaging/rabbitmq/stock.consumer.ts
```

The consumer receives stock-related messages and coordinates them with the catalog stock management functionality.

The Catalog Service does not contain Kafka messaging implementation.

## gRPC Communication

The Catalog Service exposes gRPC endpoints defined by the Protocol Buffer contracts provided by `@ecommerce/contracts`.

The gRPC configuration is located in:

```text
src/config/grpc.config.ts
```

The service also contains a gRPC client for communication with the User Service:

```text
src/grpc/user.grpc.client.ts
```

This allows the Catalog Service to communicate with the User Service through service-to-service gRPC communication.

## Database

The Catalog Service uses TypeORM for database access and persistence.

Database configuration is located in:

```text
src/config/database.config.ts
```

Database initialization and TypeORM configuration are located under:

```text
src/database/
```

The service uses database migrations to create and evolve the catalog database schema.

Migrations include:

- Initial catalog schema
- Stock reservation schema
- Product stock columns
- Stock reservation hardening

Migrations are located under:

```text
src/database/migrations/
```

## Validation

Incoming gRPC requests are validated using the shared validation infrastructure provided by `@ecommerce/common`.

Validation includes:

- Protocol Buffer validation
- gRPC request validation
- Service-level validation
- Domain-specific validation

Invalid requests are rejected before reaching the relevant business logic.

## Error Handling

The Catalog Service uses centralized exception handling provided by `@ecommerce/common`.

Domain-specific exceptions are implemented for products and categories.

Category exceptions are located under:

```text
src/catalog/categories/exceptions/
```

Product exceptions are located under:

```text
src/catalog/products/exceptions/
```

Category errors include:

- Category already exists
- Category not found

Product errors include:

- Product already exists
- Product not found

Error codes are defined through the corresponding error-code enums.

## Logging

The Catalog Service uses the shared logging infrastructure provided by `@ecommerce/common`.

Logging is initialized during application startup and is available throughout the service.

## Distributed Tracing

Distributed tracing is initialized during application startup.

The service uses the configured service name to allow requests to be correlated across the Ecommerce microservices system.

## Health Monitoring

The Catalog Service uses the shared health infrastructure provided by `@ecommerce/common`.

Health monitoring allows the availability of the service and its required dependencies to be monitored.

## Configuration

Configuration is handled through NestJS `ConfigModule`.

Configuration files are located under:

```text
src/config/
```

The configuration includes:

- Application configuration
- Database configuration
- gRPC configuration
- Environment validation

Environment variables should be configured according to the project's environment configuration.

Secrets and actual environment values should not be committed to the repository.

## Installation

Install the project dependencies:

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

Run TypeScript type checking without generating output:

```bash
npx tsc --noEmit
```

## Formatting

Format the source code using Prettier:

```bash
npx prettier --write src
```

## Docker

The repository contains Docker configuration for running the Catalog Service.

Build the Docker image:

```bash
docker build -t catalog-service .
```

The repository also contains:

```text
docker-compose.yml
```

which can be used for container-based local development.

## Shared Components

### `@ecommerce/common`

The Catalog Service uses `@ecommerce/common` for shared infrastructure and reusable functionality across the Ecommerce microservices system.

This includes functionality such as:

- Logging
- Exception handling
- gRPC utilities
- Health checks
- Validation
- Interceptors
- Messaging utilities
- Distributed tracing
- Shared utilities and interfaces

### `@ecommerce/contracts`

The Catalog Service uses `@ecommerce/contracts` for the Protocol Buffer contracts used by its gRPC APIs and service-to-service communication.

These contracts provide the shared service definitions and message structures used across the Ecommerce microservices system.
