import { Failure, getTry } from '@COMMON/exception';
import { Try, TryCatch, IFailure } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { IUser } from '@INTERFACE/user';
import { List, pipeAsync, flatten, ifSuccess, isInternal } from '@UTIL';
import { pipe } from 'rxjs';
import { ForbiddenVender, NotFoundUser, User, UserRepository } from '../core';
import { UserService } from './user.service';

export namespace VenderService {
  const _toVender = (user: IUser): Try<IProduct.Vender> =>
    getTry({
      id: user.id,
      name: user.name,
    });
  export const getVenderByToken: (
    token: string,
  ) => Promise<
    TryCatch<
      IProduct.Vender,
      | IFailure.Business.Invalid
      | IFailure.Business.Forbidden
      | IFailure.Business.Fail
    >
  > = pipeAsync(
    UserService.findOneByToken,

    ifSuccess((user: IUser) =>
      User.isVender(user) ? getTry(user) : ForbiddenVender,
    ),

    ifSuccess(_toVender),
  );

  export const findVender: (
    id: string,
  ) => Promise<
    TryCatch<
      IProduct.Vender,
      | IFailure.Business.NotFound
      | IFailure.Business.Invalid
      | IFailure.Business.Fail
    >
  > = pipeAsync(
    UserRepository.findOne,

    ifSuccess((user: IUser) =>
      User.isVender(user) ? getTry(user) : NotFoundUser,
    ),

    ifSuccess(_toVender),

    (result) => (isInternal(result) ? Failure.Business.FailUnknown : result),
  );

  export const findVendersByIds: (
    ids: string[],
  ) => Promise<Try<IProduct.Vender[]>> = pipeAsync(
    UserRepository.findManyByIds,

    ifSuccess(
      pipe(
        List.filter(User.isVender),

        List.map(_toVender),

        List.map(flatten),

        getTry,
      ),
    ),

    (result) => (isInternal(result) ? getTry([]) : result),
  );
}
