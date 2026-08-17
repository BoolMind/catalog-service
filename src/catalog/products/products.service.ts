import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';

import { BaseService } from '@ecommerce/common';
import { SEARCH_LIMIT } from '@ecommerce/common';

import { Product } from './entities/product.entity';

import { CategoriesService } from '../categories/categories.service';
import { UserGrpcClient } from '../../grpc/user.grpc.client';

import { CreateProductData, UpdateProductData } from './interfaces';

@Injectable()
export class ProductsService extends BaseService<
  Product,
  CreateProductData,
  UpdateProductData
> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,

    private readonly categoriesService: CategoriesService,

    private readonly userGrpcClient: UserGrpcClient,
  ) {
    super(repository);
  }

  protected override relations(): FindOptionsRelations<Product> {
    return {
      category: true,
    };
  }

  protected override searchableFields(): (keyof Product)[] {
    return ['name', 'description'];
  }

  protected override entityName(): string {
    return 'Product';
  }

  async create(data: CreateProductData): Promise<Product> {
    await this.userGrpcClient.getById(data.userId);

    await this.categoriesService.findOneOrFail(data.categoryId);

    return super.create(data);
  }

  async update(id: number, data: UpdateProductData): Promise<Product> {
    await this.findOneOrFail(id);

    if (data.categoryId !== undefined) {
      await this.categoriesService.findOneOrFail(data.categoryId);
    }

    return super.update(id, data);
  }

  
  async search(keyword: string): Promise<Product[]> {
    const result = await this.paginate({
      page: 1,
      limit: SEARCH_LIMIT,
      search: keyword,
    });

    return result.data;
  }

  
  async findByUser(userId: number): Promise<Product[]> {
    await this.userGrpcClient.getById(userId);

    return this.findMany({ userId } as FindOptionsWhere<Product>);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    await this.categoriesService.findOneOrFail(categoryId);

    return this.findMany({ categoryId } as FindOptionsWhere<Product>);
  }
}