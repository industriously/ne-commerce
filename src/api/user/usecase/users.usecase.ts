import { HttpExceptionFactory } from '@COMMON/exception';
import { IUser } from '@INTERFACE/user';
import { User, UserRepository } from '../core';

export namespace UsersUsecase {
  export const findOne = async (user_id: string): Promise<IUser.Public> => {
    const { is_success, result } = await UserRepository.findOne(user_id);
    if (!is_success) {
      throw HttpExceptionFactory('NotFound');
    }
    return User.toPublic(result);
  };
}
