import { Failure } from '@COMMON/exception';

export const NotFoundUser =
  Failure.getBusinessNotFound('사용자를 찾을 수 없습니다.');

export const ForbiddenAccess =
  Failure.getBusinessForbidden('인증이 필요합니다.');

export const ForbiddenVender =
  Failure.getBusinessForbidden('판매자 권한이 필요합니다.');

export const InvalidOauthProfile =
  Failure.getBusinessInvalid('필수 정보가 누락되었습니다.');
