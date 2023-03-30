import { Failure, getTry } from '@COMMON/exception';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { IAuthentication, IUser } from '@INTERFACE/user';
import { FailLogin, User, UserRepository } from '@USER/core';
import { AuthenticationService } from '@USER/service';
import {
  ifSuccess,
  pipeAsync,
  flatten,
  isBusiness,
  isFail,
  isInternal,
} from '@UTIL';

export namespace AuthenticationUsecase {
  const _getCredentials = (user: IUser): Try<IAuthentication.Credentials> => {
    return getTry({
      access_token: flatten(AuthenticationService.getAccessToken(user)),
      refresh_token: flatten(AuthenticationService.getRefreshToken(user)),
      id_token: flatten(AuthenticationService.getIdToken(user)),
    });
  };

  export const signIn = async (
    body: IAuthentication.SignInBody,
  ): Promise<TryCatch<IAuthentication.Credentials, IFailure.Business.Fail>> => {
    const profile = await AuthenticationService.getOauthProfile(body);
    if (isBusiness(profile)) return profile;

    return pipeAsync(
      UserRepository.findOneByOauthProfile,

      (result) =>
        isBusiness(result) && result.event === 'NotFound'
          ? pipeAsync(
              User.create,

              ifSuccess(UserRepository.add),
            )(profile.data)
          : result,

      ifSuccess((user: IUser) =>
        User.isInActive(user)
          ? pipeAsync(
              User.activate,

              flatten,

              UserRepository.update,
            )(user)
          : getTry(user),
      ),

      ifSuccess((user: IUser) => _getCredentials(user)),

      (result) => (isFail(result) ? FailLogin : result),
    )(profile.data);
  };

  export const refresh: (
    refresh_token: string,
  ) => Promise<
    TryCatch<string, IFailure.Business.Invalid | IFailure.Business.Fail>
  > = pipeAsync(
    AuthenticationService.getRefreshTokenPayload,

    ifSuccess((data: IAuthentication.RefreshTokenPayload) =>
      UserRepository.findOne(data.id),
    ),

    ifSuccess(AuthenticationService.getAccessToken),

    (result) =>
      isBusiness(result) && result.event === 'NotFound'
        ? Failure.Business.InvalidToken
        : result,

    (result) => (isInternal(result) ? Failure.Business.FailUnknown : result),
  );
}
