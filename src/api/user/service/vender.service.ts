import { HttpExceptionFactory } from '@COMMON/exception';
import { IProduct } from '@INTERFACE/product';
import { IUser } from '@INTERFACE/user';
import { UserRepository } from '../core';
import { UserService } from './user.service';

export namespace VenderService {
  const _toVender = (user: IUser): IProduct.Vender => {
    return {
      id: user.id,
      name: user.name,
    };
  };
  export const getVenderByToken = async (
    token: string,
  ): Promise<IProduct.Vender> => {
    const user = await UserService.findOne(token);

    if (user.role !== 'vender') {
      throw HttpExceptionFactory('Forbidden');
    }
    return _toVender(user);
  };

  export const findVender = async (
    user_id: string,
  ): Promise<IProduct.Vender> => {
    const { is_success, result } = await UserRepository.findOne(user_id);
    if (!is_success || result.role !== 'vender') {
      throw HttpExceptionFactory('NotFound');
    }
    return _toVender(result);
  };

  export const findVendersByIds = async (
    ids: string[],
  ): Promise<IProduct.Vender[]> => {
    const { is_success, result } = await UserRepository.findManyByIds(ids);
    if (!is_success) {
      throw HttpExceptionFactory('ISE');
    }
    return result.filter((user) => user.role === 'vender').map(_toVender);
  };
}
