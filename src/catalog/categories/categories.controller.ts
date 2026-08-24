import {
  GrpcController,
  ValidateGrpc,
  toGrpcDeleteResponse,
  toGrpcPageMeta,
} from '@ecommerce/common';

import {
  CategoryServiceCreateRequest,
  CategoryServiceCreateResponse,
  CategoryServiceDeleteRequest,
  CategoryServiceDeleteResponse,
  CategoryServiceFindAllRequest,
  CategoryServiceFindAllResponse,
  CategoryServiceGetByIdRequest,
  CategoryServiceGetByIdResponse,
  CategoryServicePaginateRequest,
  CategoryServicePaginateResponse,
  CategoryServiceRestoreRequest,
  CategoryServiceRestoreResponse,
  CategoryServiceUpdateRequest,
  CategoryServiceUpdateResponse,
} from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';

import { SortOrder } from '@ecommerce/contracts/generated/ecommerce/common/v1/common';

import { CategoriesService } from './categories.service';
import { categoryToGrpc } from './mappers/categories.mapper';

@GrpcController('CategoryService')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServiceCreateRequest')
  async create(
    request: CategoryServiceCreateRequest,
  ): Promise<CategoryServiceCreateResponse> {
    const category = await this.categoriesService.create(request);

    return {
      category: categoryToGrpc(category),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServiceGetByIdRequest')
  async getById(
    request: CategoryServiceGetByIdRequest,
  ): Promise<CategoryServiceGetByIdResponse> {
    const category = await this.categoriesService.findOneOrFail(request.id);

    return {
      category: categoryToGrpc(category),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServiceFindAllRequest')
  async findAll(
    _request: CategoryServiceFindAllRequest,
  ): Promise<CategoryServiceFindAllResponse> {
    const categories = await this.categoriesService.findAll();

    return {
      items: categories.map(categoryToGrpc),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServiceUpdateRequest')
  async update(
    request: CategoryServiceUpdateRequest,
  ): Promise<CategoryServiceUpdateResponse> {
    const { id, ...data } = request;

    const category = await this.categoriesService.update(id, data);

    return {
      category: categoryToGrpc(category),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServiceDeleteRequest')
  async delete(
    request: CategoryServiceDeleteRequest,
  ): Promise<CategoryServiceDeleteResponse> {
    await this.categoriesService.softDelete(request.id);

    return toGrpcDeleteResponse();
  }

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServiceRestoreRequest')
  async restore(
    request: CategoryServiceRestoreRequest,
  ): Promise<CategoryServiceRestoreResponse> {
    const category = await this.categoriesService.restore(request.id);

    return {
      category: categoryToGrpc(category),
    };
  }

  @ValidateGrpc('ecommerce.catalog.v1.CategoryServicePaginateRequest')
  async paginate(
    request: CategoryServicePaginateRequest,
  ): Promise<CategoryServicePaginateResponse> {
    const result = await this.categoriesService.paginate({
      page: request.page,
      limit: request.limit,
      search: request.search,
      orderBy: request.orderBy,
      order:
        request.order === SortOrder.SORT_ORDER_ASC
          ? 'ASC'
          : request.order === SortOrder.SORT_ORDER_DESC
            ? 'DESC'
            : undefined,
    });

    return {
      items: result.data.map(categoryToGrpc),
      meta: toGrpcPageMeta(result.meta),
    };
  }
}
