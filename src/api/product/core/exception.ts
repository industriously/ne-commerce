import { Failure } from '@COMMON/exception';

export const NotFoundProduct =
  Failure.getBusinessNotFound('상품을 찾을 수 없습니다.');

export const ForbiddenCreateProduct =
  Failure.getBusinessForbidden('상품 생성 권한이 없습니다.');
export const ForbiddenUpdateProduct = Failure.getBusinessForbidden(
  '해당 상품의 수정 권한이 없습니다.',
);

export const FailCreateProduct =
  Failure.getBusinessFail('상품 생성에 실패했습니다.');
export const FailUpdateProduct =
  Failure.getBusinessFail('상품 수정에 실패했습니다.');
