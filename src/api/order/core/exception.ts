import { Failure } from '@COMMON/exception';

export const InvalidOrderItem =
  Failure.getBusinessInvalid('유효하지 않은 상품을 포함합니다.');

export const NotFoundOrder =
  Failure.getBusinessNotFound('해당 주문을 찾을 수 없습니다.');

export const ForbiddenOrder = Failure.getBusinessForbidden(
  '해당 주문에 접근 권한이 없습니다.',
);
