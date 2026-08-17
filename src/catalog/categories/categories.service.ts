
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@ecommerce/common';

import { Category } from './entities/category.entity';

import {
  CategoryAlreadyExistsException,
} from './exceptions';

import {
  CreateCategoryData,
  UpdateCategoryData,
} from './interfaces/category-service.interface';

@Injectable()
export class CategoriesService extends BaseService<
  Category,
  CreateCategoryData,
  UpdateCategoryData
> {
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
  ) {
    super(repository);
  }

  protected override searchableFields(): (
    keyof Category
  )[] {
    return ['name', 'description'];
  }

  protected override entityName(): string {
    return 'Category';
  }

  async create(
    data: CreateCategoryData,
  ): Promise<Category> {
    const existing = await this.findOne({
      where: {
        name: data.name,
      },
    });

    if (existing) {
      throw new CategoryAlreadyExistsException(
        data.name,
      );
    }

    return super.create(data);
  }

  async update(
    id: number,
    data: UpdateCategoryData,
  ): Promise<Category> {
    const category =
      await this.findOneOrFail(id);

    if (
      data.name !== undefined &&
      data.name !== category.name
    ) {
      const existing = await this.findOne({
        where: {
          name: data.name,
        },
      });

      if (existing) {
        throw new CategoryAlreadyExistsException(
          data.name,
        );
      }
    }

    return super.update(id, data);
  }
}

