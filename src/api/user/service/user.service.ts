import {
  ifSuccess,
  isBusinessNotFound,
  isInternalInvalid,
  pipeAsync,
} from '@UTIL';
import { IAuthentication, IUser } from '@INTERFACE/user';
import { UserRepository } from '../core';
import { AuthenticationService } from './auth.service';
import { TryCatch, IFailure } from '@INTERFACE/common';
import { Failure } from '@COMMON/exception';

export namespace UserService {
  export const findOneByToken: (
    token: string,
  ) => Promise<TryCatch<IUser, IFailure.Business.Invalid>> = pipeAsync(
    AuthenticationService.getAccessTokenPayload,

    ifSuccess((payload: IAuthentication.AccessTokenPayload) =>
      UserRepository.findOne(payload.id),
    ),

    (result) =>
      isBusinessNotFound(result) || isInternalInvalid(result)
        ? Failure.Business.InvalidToken
        : result,
  );
}
