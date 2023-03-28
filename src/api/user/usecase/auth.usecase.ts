import { HttpExceptionFactory } from '@COMMON/exception';
import { IAuthentication } from '@INTERFACE/user';
import { TryCatch } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { AuthenticationService } from '../service';
import { User, UserRepository } from '../core';

export namespace AuthenticationUsecase {
  const _getCredentials = (user: IUser): IAuthentication.Credentials => {
    return {
      access_token: AuthenticationService.getAccessToken(user),
      refresh_token: AuthenticationService.getRefreshToken(user),
      id_token: AuthenticationService.getIdToken(user),
    };
  };
  const _getCredentialsOrThrow = (
    input: TryCatch<IUser>,
  ): IAuthentication.Credentials => {
    const { is_success, result } = input;
    if (!is_success) {
      throw HttpExceptionFactory('UnAuthorized', '로그인에 실패했습니다.');
    }
    return _getCredentials(result);
  };
  export const signIn = async (
    profile: IAuthentication.OauthProfile,
  ): Promise<IAuthentication.Credentials> => {
    const user = await UserRepository.findOneByOauthProfile(profile);

    // 사용자 정보가 없는 경우, 최초 로그인
    if (!user.is_success) {
      const input = await UserRepository.add(User.create(profile));
      return _getCredentialsOrThrow(input);
    }

    // 사용자가 기존에 가입했지만 비활성화된 경우
    if (User.isInActive(user.result)) {
      const input = await UserRepository.update(User.activate(user.result));
      return _getCredentialsOrThrow(input);
    }
    return _getCredentials(user.result);
  };

  export const refresh = async (
    token: string,
  ): Promise<IAuthentication.RefreshedCredential> => {
    const payload = AuthenticationService.getRefreshTokenPayload(token);
    const { is_success, result } = await UserRepository.findOne(payload.id);
    if (!is_success) {
      throw HttpExceptionFactory('Forbidden');
    }
    return { access_token: AuthenticationService.getAccessToken(result) };
  };
}
