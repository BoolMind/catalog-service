import { Product as ProductEntity } from '../entities/product.entity';
import { Product as ProductGrpc } from '@ecommerce/contracts/generated/ecommerce/catalog/v1/catalog';

import { dateToTimestamp } from '@ecommerce/common';

export function productToGrpc(product: ProductEntity): ProductGrpc {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: Number(product.price),
    categoryId: product.categoryId,
    userId: product.userId,
    totalStock: product.totalStock,
    reservedStock: product.reservedStock,
    availableStock: product.availableStock,
    createdAt: dateToTimestamp(product.createdAt),
    updatedAt: dateToTimestamp(product.updatedAt),

    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          description: product.category.description ?? '',
          createdAt: dateToTimestamp(product.category.createdAt),
          updatedAt: dateToTimestamp(product.category.updatedAt),
        }
      : undefined,
  };
}
