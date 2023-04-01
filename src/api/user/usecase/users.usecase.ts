import { TryCatch, IFailure } from '@INTERFACE/common';
import { getTry, HttpExceptionFactory } from '@COMMON/exception';
import { ifSuccess, isInternalInvalid, pipeAsync, throwError } from '@UTIL';
import { User, UserRepository } from '../core';
import { IUser } from '@INTERFACE/user';

export namespace UsersUsecase {
  export const findOne: (
    id: string,
  ) => Promise<TryCatch<IUser.Public, IFailure.Business.NotFound>> = pipeAsync(
    UserRepository.findOne,

    ifSuccess((user: IUser) => getTry(User.toPublic(user))),

    (result) =>
      isInternalInvalid(result)
        ? throwError(HttpExceptionFactory('Unprocessable Entity'))
        : result,
  );
}
