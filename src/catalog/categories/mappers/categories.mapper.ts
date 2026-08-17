import { Category as CategoryEntity } from '../entities/category.entity';

import { Category as CategoryGrpc } from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';

import { dateToTimestamp } from '@ecommerce/common';

export function categoryToGrpc(category: CategoryEntity): CategoryGrpc {
  return {
    id: category.id,

    name: category.name,

    description: category.description ?? '',

    createdAt: dateToTimestamp(category.createdAt),

    updatedAt: dateToTimestamp(category.updatedAt),
  };
}
