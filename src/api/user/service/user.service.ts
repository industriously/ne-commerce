import {
  ifSuccess,
  isBusinessNotFound,
  isInternalInvalid,
  pipeAsync,
} from '@UTIL';
import { ICredentials, IUser } from '@INTERFACE/user';
import { AuthenticationService } from './auth.service';
import { TryCatch, IFailure } from '@INTERFACE/common';
import { Failure } from '@COMMON/exception';
import { UserRepository } from '@USER/core';

export namespace UserService {
  export const findOneByToken: (
    token: string,
  ) => Promise<TryCatch<IUser, IFailure.Business.Invalid>> = pipeAsync(
    AuthenticationService.getAccessTokenPayload,

    ifSuccess(
      ({
        id,
      }: ICredentials.IAccessTokenPayload): Promise<
        TryCatch<IUser, IFailure.Internal.Invalid | IFailure.Business.NotFound>
      > => UserRepository.findOne(id),
    ),

    (result) =>
      isBusinessNotFound(result) || isInternalInvalid(result)
        ? Failure.Business.InvalidToken
        : result,
  );
}
