import { NotFoundExceptionBase } from '@ecommerce/common';
import { CategoryErrorCode } from './category.error-code.enum';


export class CategoryNotFoundException
  extends NotFoundExceptionBase<CategoryErrorCode> {

  constructor() {
    super(
      CategoryErrorCode.NOT_FOUND,
      'Category not found',
    );
  }
}