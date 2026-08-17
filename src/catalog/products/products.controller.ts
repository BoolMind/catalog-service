import { GrpcController } from '@ecommerce/common';
import { toGrpcDeleteResponse, toGrpcPageMeta } from '@ecommerce/common';

import {
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

import { ProductsService } from './products.service';
import { productToGrpc } from './mappers/products.mapper';

@GrpcController('ProductService')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async create(
    request: ProductServiceCreateRequest,
  ): Promise<ProductServiceCreateResponse> {
    const product = await this.productsService.create(request);

    return {
      product: productToGrpc(product),
    };
  }

  async getById(
    request: ProductServiceGetByIdRequest,
  ): Promise<ProductServiceGetByIdResponse> {
    const product = await this.productsService.findOneOrFail(
      request.id,
    );

    return {
      product: productToGrpc(product),
    };
  }

  async update(
    request: ProductServiceUpdateRequest,
  ): Promise<ProductServiceUpdateResponse> {
    const { id, ...data } = request;

    const product = await this.productsService.update(id, data);

    return {
      product: productToGrpc(product),
    };
  }

  async delete(
  request: ProductServiceDeleteRequest,
): Promise<ProductServiceDeleteResponse> {
  await this.productsService.softDelete(request.id);

  return toGrpcDeleteResponse();
}

  async restore(
    request: ProductServiceRestoreRequest,
  ): Promise<ProductServiceRestoreResponse> {
    const product = await this.productsService.restore(
      request.id,
    );

    return {
      product: productToGrpc(product),
    };
  }

  async paginate(
    request: ProductServicePaginateRequest,
  ): Promise<ProductServicePaginateResponse> {
    const result = await this.productsService.paginate({
      page: request.page,
      limit: request.limit,
      search: request.search,
      orderBy: request.orderBy,
      order:
        request.order === 1
          ? 'ASC'
          : request.order === 2
            ? 'DESC'
            : undefined,
    });

    return {
      items: result.data.map(productToGrpc),
      meta: toGrpcPageMeta(result.meta),
    };
  }

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

  async findByUser(
    request: ProductServiceFindByUserRequest,
  ): Promise<ProductServiceFindByUserResponse> {
    const products = await this.productsService.findByUser(
      request.userId,
    );

    return {
      items: products.map(productToGrpc),
    };
  }
}