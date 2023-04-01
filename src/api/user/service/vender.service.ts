import { getTry } from '@COMMON/exception';
import { Try, TryCatch, IFailure } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { IUser } from '@INTERFACE/user';
import { List, pipeAsync, flatten, ifSuccess, isInternal } from '@UTIL';
import { ForbiddenVender, NotFoundUser, User, UserRepository } from '../core';
import { UserService } from './user.service';

export namespace VenderService {
  const _toVender = (user: IUser): IProduct.Vender => ({
    id: user.id,
    name: user.name,
  });

  export const getVenderByToken: (
    token: string,
  ) => Promise<
    TryCatch<
      IProduct.Vender,
      IFailure.Business.Invalid | IFailure.Business.Forbidden
    >
  > = pipeAsync(
    UserService.findOneByToken,

    ifSuccess((user: IUser) =>
      User.isVender(user) ? getTry(_toVender(user)) : ForbiddenVender,
    ),
  );

  export const findVender: (
    id: string,
  ) => Promise<TryCatch<IProduct.Vender, IFailure.Business.NotFound>> =
    pipeAsync(
      UserRepository.findOne,

      ifSuccess((user: IUser) =>
        User.isVender(user) ? getTry(_toVender(user)) : NotFoundUser,
      ),

      (result) => (isInternal(result) ? NotFoundUser : result),
    );

  export const findVendersByIds: (
    ids: string[],
  ) => Promise<Try<IProduct.Vender[]>> = pipeAsync(
    UserRepository.findManyByIds,

    flatten,

    List.filter(User.isVender),

    List.map(_toVender),

    getTry,
  );
}
