import { AlreadyExistsExceptionBase } from '@ecommerce/common';
import { CategoryErrorCode } from './category.error-code.enum';


export class CategoryAlreadyExistsException
  extends AlreadyExistsExceptionBase<CategoryErrorCode> {
  constructor(name: string) {
    super(
      CategoryErrorCode.ALREADY_EXISTS,
      `Category '${name}' already exists`,
    );
  }
}
