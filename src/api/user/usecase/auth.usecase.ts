import { Exception, getSuccessReturn } from '@COMMON/exception';
import { Try, TryCatch } from '@INTERFACE/common';
import { IAuthentication, IUser } from '@INTERFACE/user';
import { User, UserRepository } from '@USER/core';
import { AuthenticationService } from '@USER/service';
import { ifSuccess, pipeAsync, flatten } from '@UTIL';

export namespace AuthenticationUsecase {
  const _getCredentials = (user: IUser): Try<IAuthentication.Credentials> => {
    return getSuccessReturn({
      access_token: flatten(AuthenticationService.getAccessToken(user)),
      refresh_token: flatten(AuthenticationService.getRefreshToken(user)),
      id_token: flatten(AuthenticationService.getIdToken(user)),
    });
  };

  export const signIn = async (
    body: IAuthentication.SignInBody,
  ): Promise<
    TryCatch<IAuthentication.Credentials, typeof Exception.LOGIN_FAIL>
  > => {
    const profile = await AuthenticationService.getOauthProfile(body);
    if (profile.code === '4004') return profile;
    return pipeAsync(
      UserRepository.findOneByOauthProfile,

      ifSuccess((user: IUser) =>
        User.isInActive(user)
          ? UserRepository.update(User.activate(user).data)
          : getSuccessReturn(user),
      ),

      (result) =>
        result.code === '4006'
          ? pipeAsync(
              User.create,

              ifSuccess(UserRepository.add),
            )(profile.data)
          : result,

      (result) =>
        result.code === '1000' ? _getCredentials(result.data) : result,

      (result) => (result.code === '1000' ? result : Exception.LOGIN_FAIL),
    )(profile.data);
  };

  export const refresh = pipeAsync(
    AuthenticationService.getRefreshTokenPayload,

    ifSuccess((data: IAuthentication.RefreshTokenPayload) =>
      UserRepository.findOne(data.id),
    ),

    (result) =>
      result.code === '1000'
        ? AuthenticationService.getAccessToken(result.data)
        : result,
  );
}
