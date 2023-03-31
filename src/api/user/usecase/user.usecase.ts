import { Failure, getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { pipeAsync, ifSuccess, isBusinessNotFound } from '@UTIL';
import { User, UserRepository } from '../core';
import { UserService } from '../service';

export namespace UserUsecase {
  export const findOne: (
    token: string,
  ) => Promise<TryCatch<IUser.Detail, IFailure.Business.Invalid>> = pipeAsync(
    UserService.findOneByToken,

    ifSuccess((user: IUser) => getTry(User.toDetail(user))),
  );

  export const update = (
    token: string,
    input: IUser.UpdateInput,
  ): Promise<TryCatch<IUser.Detail, IFailure.Business.Invalid>> => {
    return pipeAsync(
      UserService.findOneByToken,

      ifSuccess((user: IUser) =>
        UserRepository.update(User.update(user, input)),
      ),

      ifSuccess((user: IUser) => getTry(User.toDetail(user))),

      (result) =>
        isBusinessNotFound(result) ? Failure.Business.InvalidToken : result,
    )(token);
  };

  export const inActivate: (
    token: string,
  ) => Promise<TryCatch<true, IFailure.Business.Invalid>> = pipeAsync(
    UserService.findOneByToken,

    ifSuccess((user: IUser) => UserRepository.update(User.inActivate(user))),

    ifSuccess(() => getTry(true as const)),

    (result) =>
      isBusinessNotFound(result) ? Failure.Business.InvalidToken : result,
  );
}
