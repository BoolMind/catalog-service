# Catalog Service

The Catalog Service manages products and categories for the Ecommerce Microservices system.

It communicates with other services through gRPC and maintains its own MySQL database.

## Architecture

```text
API Gateway
     |
     | gRPC
     v
Catalog Service
     |
     v
MySQL
```

## Responsibilities

### Products

* Create products
* Retrieve products
* Update products
* Delete products
* Restore products
* Retrieve products by category
* Retrieve products by user

### Categories

* Create categories
* Retrieve categories
* Update categories
* Delete categories
* Restore categories

## Tech Stack

* Node.js
* NestJS
* TypeScript
* TypeORM
* MySQL
* gRPC
* Protocol Buffers

## Related Services

* [API Gateway](https://github.com/BoolMind/api-gateway)
* [User Service](https://github.com/BoolMind/user-service)
* [Common](https://github.com/BoolMind/ecommerce-common)
* [Ecommerce Contracts](https://github.com/BoolMind/ecommerce-contracts)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
NODE_ENV=development
SERVICE_NAME=catalog-service
PORT=3002

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_NAME=catalog_db

DB_SYNCHRONIZE=false
DB_LOGGING=false

GRPC_HOST=localhost
GRPC_PORT=50052
```

Do not commit the `.env` file.

## Database

The service uses MySQL and TypeORM.

Database schema changes are managed using TypeORM migrations.

Run migrations:

```bash
npm run migration:run
```

Generate a migration:

```bash
npm run migration:generate
```

## Running the Application

Development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm run start:prod
```

## License

Private project developed under BoolMind.
