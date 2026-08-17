import { ProductErrorCode } from './product-error-code.enum';
import { NotFoundExceptionBase } from '@ecommerce/common';

export class ProductNotFoundException
  extends NotFoundExceptionBase<ProductErrorCode>
{
  constructor(id: number) {
    super(
      ProductErrorCode.PRODUCT_NOT_FOUND,
      `Product with id ${id} not found`,
    );
  }
}