import { ifSuccess, pipeAsync } from '@UTIL';
import { User, UserRepository } from '../core';

export namespace UsersUsecase {
  export const findOne = pipeAsync(
    UserRepository.findOne,

    ifSuccess(User.toPublic),
  );
}
