import { _findOne } from '@COMMON/service';
import { IUser } from '@INTERFACE/user';
import { UserRepository } from '../core';
import { AuthenticationService } from './auth.service';

export namespace UserService {
  export const findOne = async (token: string): Promise<IUser> => {
    const { id } = AuthenticationService.getAccessTokenPayload(token);
    return _findOne(UserRepository.findOne)(id);
  };
}
