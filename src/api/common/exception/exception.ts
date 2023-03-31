import { IFailure } from '@INTERFACE/common';

export namespace Failure {
  export const getInternal =
    <T extends IFailure.Internal.Type>(event: T) =>
    (message: string): IFailure.Internal<T> => ({
      type: 'internal',
      event,
      message,
    });

  export const getInternalInvalid: (
    message: string,
  ) => IFailure.Internal.Invalid = getInternal('Invalid');

  export const getInternalFail: (message: string) => IFailure.Internal.Fail =
    getInternal('Fail');

  export const getBusiness =
    <T extends IFailure.Business.Type>(event: T) =>
    (message: string): IFailure.Business<T> => ({
      type: 'business',
      event,
      message,
    });

  export const getBusinessNotFound: (
    message: string,
  ) => IFailure.Business.NotFound = getBusiness('NotFound');

  export const getBusinessInvalid: (
    message: string,
  ) => IFailure.Business.Invalid = getBusiness('Invalid');

  export const getBusinessForbidden: (
    message: string,
  ) => IFailure.Business.Forbidden = getBusiness('Forbidden');

  export namespace Internal {
    export const InvalidValue = getInternalInvalid(
      '유요하지 않은 값이 포함되었습니다.',
    );
    export const FailDB = getInternalFail('데이터베이스 요청이 실패했습니다.');
    export const UnknownError = getInternalFail(
      '알 수 없는 이유로 요청을 수행하지 못했습니다.',
    );
  }

  export namespace Business {
    export const InvalidBody = getBusinessInvalid('유효하지 않은 body입니다.');
    export const InvalidQuery =
      getBusinessInvalid('유효하지 않은 query입니다.');
    export const InvalidParam =
      getBusinessInvalid('유효하지 않은 param입니다.');
    export const InvalidToken = getBusinessInvalid('유효하지 않은 토큰입니다.');
  }
}
