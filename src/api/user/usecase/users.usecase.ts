import { TryCatch, IFailure } from '@INTERFACE/common';
import { Failure } from '@COMMON/exception';
import { ifSuccess, isInternal, pipeAsync } from '@UTIL';
import { User, UserRepository } from '../core';
import { IUser } from '@INTERFACE/user';

export namespace UsersUsecase {
  export const findOne: (
    id: string,
  ) => Promise<
    TryCatch<IUser.Public, IFailure.Business.NotFound | IFailure.Business.Fail>
  > = pipeAsync(
    UserRepository.findOne,

    ifSuccess(User.toPublic),

    (result) => (isInternal(result) ? Failure.Business.FailUnknown : result),
  );
}
