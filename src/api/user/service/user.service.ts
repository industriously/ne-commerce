import { ifSuccess, pipeAsync } from '@UTIL';
import { IAuthentication } from '@INTERFACE/user';
import { UserRepository } from '../core';
import { AuthenticationService } from './auth.service';
import { Exception } from '@COMMON/exception';

export namespace UserService {
  export const findOneByToken = pipeAsync(
    AuthenticationService.getAccessTokenPayload,

    ifSuccess((payload: IAuthentication.AccessTokenPayload) =>
      UserRepository.findOne(payload.id),
    ),

    (result) => (result.code === '4000' ? Exception.USER_NOT_FOUND : result),
  );
}
