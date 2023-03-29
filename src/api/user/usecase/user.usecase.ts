import { Exception, getSuccessReturn } from '@COMMON/exception';
import { TryCatch } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { pipeAsync, ifSuccess } from '@UTIL';
import { User, UserRepository } from '../core';
import { UserService } from '../service';

export namespace UserUsecase {
  export const findOne = pipeAsync(
    UserService.findOneByToken,

    (result) =>
      result.code === '1000'
        ? getSuccessReturn(User.toDetail(result.data))
        : result,
  );

  export const update = (
    token: string,
    input: IUser.UpdateInput,
  ): Promise<
    TryCatch<
      IUser.Detail,
      typeof Exception.USER_NOT_FOUND | typeof Exception.INVALID_TOKEN
    >
  > => {
    return pipeAsync(
      UserService.findOneByToken,

      ifSuccess((user: IUser) => User.update(user, input)),

      (result) => (result.code === '4000' ? Exception.USER_NOT_FOUND : result),

      ifSuccess(UserRepository.update),

      (result) =>
        result.code === '1000'
          ? getSuccessReturn(User.toDetail(result.data))
          : result,
    )(token);
  };

  export const inActivate = pipeAsync(
    UserService.findOneByToken,

    ifSuccess((user: IUser) => UserRepository.update(User.inActivate(user))),

    (result) => (result.code === '1000' ? getSuccessReturn(null) : result),
  );
}
