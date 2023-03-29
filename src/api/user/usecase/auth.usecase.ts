import { Exception, getSuccessReturn } from '@COMMON/exception';
import { TryCatch } from '@INTERFACE/common';
import { IAuthentication, IUser } from '@INTERFACE/user';
import { User, UserRepository } from '@USER/core';
import { AuthenticationService } from '@USER/service';
import { ifSuccess, pipeAsync } from '@UTIL';

export namespace AuthenticationUsecase {
  const _getCredentials = (user: IUser): IAuthentication.Credentials => {
    return {
      access_token: AuthenticationService.getAccessToken(user),
      refresh_token: AuthenticationService.getRefreshToken(user),
      id_token: AuthenticationService.getIdToken(user),
    };
  };

  export const signIn = async (
    body: IAuthentication.SignInBody,
  ): Promise<
    TryCatch<IAuthentication.Credentials, typeof Exception.LOGIN_FAIL>
  > => {
    const profile = await AuthenticationService.getOauthProfile(body);
    return pipeAsync(
      UserRepository.findOneByOauthProfile,

      ifSuccess((user: IUser) =>
        User.isInActive(user)
          ? UserRepository.update(User.activate(user))
          : getSuccessReturn(user),
      ),

      (result) =>
        result.code === '4006'
          ? pipeAsync(
              User.create,

              ifSuccess(UserRepository.add),
            )(profile)
          : result,

      (result) =>
        result.code === '1000'
          ? getSuccessReturn(_getCredentials(result.data))
          : result,

      (result) => (result.code === '1000' ? result : Exception.LOGIN_FAIL),
    )(profile);
  };

  export const refresh = pipeAsync(
    AuthenticationService.getRefreshTokenPayload,

    ifSuccess((data: IAuthentication.RefreshTokenPayload) =>
      UserRepository.findOne(data.id),
    ),

    (result) => (result.code === '4000' ? Exception.USER_NOT_FOUND : result),

    (result) =>
      result.code === '1000'
        ? getSuccessReturn(AuthenticationService.getAccessToken(result.data))
        : result,
  );
}
