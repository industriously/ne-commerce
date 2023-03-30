import { Failure, getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { pipeAsync, ifSuccess, isInternal, isBusiness, flatten } from '@UTIL';
import { User, UserRepository } from '../core';
import { UserService } from '../service';

export namespace UserUsecase {
  export const findOne: (
    token: string,
  ) => Promise<
    TryCatch<IUser.Detail, IFailure.Business.Invalid | IFailure.Business.Fail>
  > = pipeAsync(
    UserService.findOneByToken,

    ifSuccess(User.toDetail),
  );

  export const update = (
    token: string,
    input: IUser.UpdateInput,
  ): Promise<
    TryCatch<IUser.Detail, IFailure.Business.Invalid | IFailure.Business.Fail>
  > => {
    return pipeAsync(
      UserService.findOneByToken,

      ifSuccess((user: IUser) => User.update(user, input)),

      ifSuccess(UserRepository.update),

      ifSuccess(User.toDetail),

      (result) =>
        isBusiness(result) && result.event === 'NotFound'
          ? Failure.Business.InvalidRequest
          : result,

      (result) => (isInternal(result) ? Failure.Business.FailUnknown : result),
    )(token);
  };

  export const inActivate: (
    token: string,
  ) => Promise<
    TryCatch<true, IFailure.Business.Invalid | IFailure.Business.Fail>
  > = pipeAsync(
    UserService.findOneByToken,

    ifSuccess(
      pipeAsync(
        User.inActivate,

        flatten,

        UserRepository.update,
      ),
    ),

    ifSuccess(() => getTry(true as const)),

    (result) =>
      isBusiness(result) && result.event === 'NotFound'
        ? Failure.Business.InvalidRequest
        : result,

    (result) => (isInternal(result) ? Failure.Business.FailUnknown : result),
  );
}
