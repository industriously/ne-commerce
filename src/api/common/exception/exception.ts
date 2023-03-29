import { IException } from '@INTERFACE/common';

export const Exception = {
  INVALID_VALUE: {
    code: '4000',
    data: '유효하지 않은 값이 포함되었습니다.',
  } as const,
  INVALID_BODY: {
    code: '4001',
    data: '유효하지 않은 body입니다.',
  } as const,
  INVALID_QUERY: {
    code: '4002',
    data: '유효하지 않은 query입니다.',
  } as const,
  INVALID_PARAM: {
    code: '4003',
    data: '유효하지 않은 param입니다.',
  } as const,
  LOGIN_FAIL: { code: '4004', data: '로그인에 실패했습니다.' } as const,
  USER_NOT_FOUND: {
    code: '4006',
    data: '사용자를 찾을 수 없습니다.',
  } as const,
  UNAUTHORIZED: { code: '4005', data: '인증이 필요합니다.' } as const,
  FORBIDDEN: { code: '4006', data: '권한이 없습니다.' } as const,
  INVALID_TOKEN: { code: '4007', data: '잘못된 토큰입니다.' } as const,
  FORBIDDEN_VENDER: { code: '4008', data: '판매자 권한이 없습니다.' } as const,
  PRODUCT_NOT_FOUND: {
    code: '4009',
    data: '상품을 찾을 수 없습니다.',
  } as const,
  FORBIDDEN_PRODUCT_UPDATE: {
    code: '4010',
    data: '해당 상품의 수정 권한이 없습니다.',
  } as const,
  PRODUCT_CREATE_FAIL: {
    code: '4011',
    data: '상품 생성에 실패했습니다.',
  } as const,
  PRODUCT_UPDATE_FAIL: {
    code: '4012',
    data: '상품 수정에 실패했습니다.',
  } as const,
  UNKNOWN_ERROR: {
    code: '5000',
    data: '알 수 없는 오류가 발생했습니다.',
  } as const,
} satisfies Record<string, IException>;
