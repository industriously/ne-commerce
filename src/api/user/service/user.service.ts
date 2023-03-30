import { ifSuccess, isBusiness, isInternal, pipeAsync } from '@UTIL';
import { IAuthentication, IUser } from '@INTERFACE/user';
import { UserRepository } from '../core';
import { AuthenticationService } from './auth.service';
import { TryCatch, IFailure } from '@INTERFACE/common';
import { Failure } from '@COMMON/exception';

export namespace UserService {
  export const findOneByToken: (
    token: string,
  ) => Promise<
    TryCatch<IUser, IFailure.Business.Invalid | IFailure.Business.Fail>
  > = pipeAsync(
    AuthenticationService.getAccessTokenPayload,

    ifSuccess((payload: IAuthentication.AccessTokenPayload) =>
      UserRepository.findOne(payload.id),
    ),

    (result) =>
      isBusiness(result) && result.event === 'NotFound'
        ? Failure.Business.InvalidToken
        : result,

    (result) => (isInternal(result) ? Failure.Business.FailUnknown : result),
  );
}
