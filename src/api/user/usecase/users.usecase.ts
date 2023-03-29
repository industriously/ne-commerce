import { Exception, getSuccessReturn } from '@COMMON/exception';
import { pipeAsync } from '@UTIL';
import { User, UserRepository } from '../core';

export namespace UsersUsecase {
  export const findOne = pipeAsync(
    UserRepository.findOne,

    (result) => (result.code === '4000' ? Exception.USER_NOT_FOUND : result),

    (result) =>
      result.code === '1000'
        ? getSuccessReturn(User.toPublic(result.data))
        : result,
  );
}
