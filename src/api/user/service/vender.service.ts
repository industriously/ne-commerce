import { Exception, getSuccessReturn } from '@COMMON/exception';
import { IProduct } from '@INTERFACE/product';
import { IUser } from '@INTERFACE/user';
import { List, pipeAsync } from '@UTIL';
import { UserRepository } from '../core';
import { UserService } from './user.service';

export namespace VenderService {
  const _toVender = (user: IUser): IProduct.Vender => {
    return {
      id: user.id,
      name: user.name,
    };
  };
  export const getVenderByToken = pipeAsync(
    UserService.findOneByToken,

    (result) =>
      result.code === '1000'
        ? result.data.role !== 'vender'
          ? Exception.FORBIDDEN_VENDER
          : result
        : result,

    (result) =>
      result.code === '1000'
        ? getSuccessReturn(_toVender(result.data))
        : result,
  );

  export const findVender = pipeAsync(
    UserRepository.findOne,

    (result) => (result.code === '4000' ? Exception.USER_NOT_FOUND : result),

    (result) =>
      result.code === '1000'
        ? result.data.role !== 'vender'
          ? Exception.USER_NOT_FOUND
          : result
        : result,

    (result) =>
      result.code === '1000'
        ? getSuccessReturn(_toVender(result.data))
        : result,
  );

  export const findVendersByIds = pipeAsync(
    UserRepository.findManyByIds,

    List.filter((user) => user.role === 'vender'),

    List.map(_toVender),
  );
}
