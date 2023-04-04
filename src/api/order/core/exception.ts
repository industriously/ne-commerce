import { Failure } from '@COMMON/exception';

export const InvalidOrderItem =
  Failure.getBusinessInvalid('유효하지 않은 상품을 포함합니다.');
