import {
  GrpcController,
  ValidateGrpc,
  toGrpcDeleteResponse,
  toGrpcPageMeta,
} from '@ecommerce/common';
import { Controller } from '@nestjs/common';

import {
  ProductServiceAddStockRequest,
  ProductServiceAddStockResponse,
  ProductServiceCreateRequest,
  ProductServiceCreateResponse,
  ProductServiceDeleteRequest,
  ProductServiceDeleteResponse,
  ProductServiceFindByCategoryRequest,
  ProductServiceFindByCategoryResponse,
  ProductServiceFindByUserRequest,
  ProductServiceFindByUserResponse,
  ProductServiceGetByIdRequest,
  ProductServiceGetByIdResponse,
  ProductServicePaginateRequest,
  ProductServicePaginateResponse,
  ProductServiceRestoreRequest,
  ProductServiceRestoreResponse,
  ProductServiceUpdateRequest,
  ProductServiceUpdateResponse,
} from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';

import { toTypeOrmOrder } from '@ecommerce/common';

import { ProductsService } from './products.service';
import { StockService } from './stock.service';
import { productToGrpc } from './mappers/products.mapper';

@GrpcController('ProductService')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
  ) {}

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceCreateRequest')
  async create(
    request: ProductServiceCreateRequest,
  ): Promise<ProductServiceCreateResponse> {
    const product = await this.productsService.create(request);

    return {
      product: productToGrpc(product),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceGetByIdRequest')
  async getById(
    request: ProductServiceGetByIdRequest,
  ): Promise<ProductServiceGetByIdResponse> {
    const product = await this.productsService.findOneOrFail(request.id);

    return {
      product: productToGrpc(product),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceUpdateRequest')
  async update(
    request: ProductServiceUpdateRequest,
  ): Promise<ProductServiceUpdateResponse> {
    const { id, ...data } = request;

    const product = await this.productsService.update(id, data);

    return {
      product: productToGrpc(product),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceDeleteRequest')
  async delete(
    request: ProductServiceDeleteRequest,
  ): Promise<ProductServiceDeleteResponse> {
    await this.productsService.softDelete(request.id);

    return toGrpcDeleteResponse();
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceRestoreRequest')
  async restore(
    request: ProductServiceRestoreRequest,
  ): Promise<ProductServiceRestoreResponse> {
    const product = await this.productsService.restore(request.id);

    return {
      product: productToGrpc(product),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServicePaginateRequest')
  async paginate(
    request: ProductServicePaginateRequest,
  ): Promise<ProductServicePaginateResponse> {
    const result = await this.productsService.paginate({
      page: request.page,
      limit: request.limit,
      search: request.search,
      orderBy: request.orderBy,
      order: toTypeOrmOrder(request.order),
    });

    return {
      items: result.data.map(productToGrpc),
      meta: toGrpcPageMeta(result.meta),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceFindByCategoryRequest')
  async findByCategory(
    request: ProductServiceFindByCategoryRequest,
  ): Promise<ProductServiceFindByCategoryResponse> {
    const products = await this.productsService.findByCategory(
      request.categoryId,
    );

    return {
      items: products.map(productToGrpc),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceFindByUserRequest')
  async findByUser(
    request: ProductServiceFindByUserRequest,
  ): Promise<ProductServiceFindByUserResponse> {
    const products = await this.productsService.findByUser(request.userId);

    return {
      items: products.map(productToGrpc),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.ProductServiceAddStockRequest')
  async addStock(
    request: ProductServiceAddStockRequest,
  ): Promise<ProductServiceAddStockResponse> {
    const product = await this.stockService.addStock(
      request.productId,
      request.quantity,
    );

    return {
      product: productToGrpc(product),
    };
  }
}
