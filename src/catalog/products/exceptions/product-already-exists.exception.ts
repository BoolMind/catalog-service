import { ProductErrorCode } from './product-error-code.enum';
import { AlreadyExistsExceptionBase } from '@ecommerce/common';

export class ProductAlreadyExistsException extends AlreadyExistsExceptionBase<ProductErrorCode> {
  constructor(name: string) {
    super(
      ProductErrorCode.PRODUCT_ALREADY_EXISTS,
      `Product "${name}" already exists.`,
    );
  }
}
