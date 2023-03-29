import { Exception, getSuccessReturn } from '@COMMON/exception';
import { Try } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { IUser } from '@INTERFACE/user';
import { List, pipeAsync, flatten, ifSuccess } from '@UTIL';
import { UserRepository } from '../core';
import { UserService } from './user.service';

export namespace VenderService {
  const _toVender = (user: IUser): Try<IProduct.Vender> =>
    getSuccessReturn({
      id: user.id,
      name: user.name,
    });
  export const getVenderByToken = pipeAsync(
    UserService.findOneByToken,

    (result) => (result.code === '4006' ? Exception.FORBIDDEN_VENDER : result),

    ifSuccess<IUser, IUser, typeof Exception.FORBIDDEN_VENDER>((user) =>
      user.role === 'vender'
        ? getSuccessReturn(user)
        : Exception.FORBIDDEN_VENDER,
    ),

    ifSuccess(_toVender),
  );

  export const findVender = pipeAsync(
    UserRepository.findOne,

    ifSuccess<IUser, IUser, typeof Exception.USER_NOT_FOUND>((user) =>
      user.role === 'vender'
        ? getSuccessReturn(user)
        : Exception.USER_NOT_FOUND,
    ),

    ifSuccess(_toVender),
  );

  export const findVendersByIds = pipeAsync(
    UserRepository.findManyByIds,

    flatten,

    List.filter((user) => user.role === 'vender'),

    List.map(_toVender),

    List.map(flatten),

    getSuccessReturn,
  );
}
