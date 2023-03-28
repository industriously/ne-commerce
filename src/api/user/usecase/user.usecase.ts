import { HttpExceptionFactory } from '@COMMON/exception';
import { IUser } from '@INTERFACE/user';
import { User, UserRepository } from '../core';
import { UserService } from '../service';

export namespace UserUsecase {
  export const findOne = async (token: string): Promise<IUser.Detail> => {
    const user = await UserService.findOne(token);
    return User.toDetail(user);
  };
  export const update = async (
    token: string,
    input: IUser.UpdateInput,
  ): Promise<IUser.Detail> => {
    const user = await UserService.findOne(token);
    const { is_success, result, message } = await UserRepository.update(
      User.update(user, input),
    );
    if (!is_success) {
      throw HttpExceptionFactory('BadRequest', message);
    }
    return User.toDetail(result);
  };
  export const inActivate = async (token: string): Promise<void> => {
    const user = await UserService.findOne(token);

    const { is_success, message } = await UserRepository.update(
      User.inActivate(user),
    );
    if (!is_success) {
      throw HttpExceptionFactory('BadRequest', message);
    }
    return;
  };
}
