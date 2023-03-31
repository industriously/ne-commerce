import { Failure, getTry, HttpExceptionFactory } from '@COMMON/exception';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { IAuthentication, IUser } from '@INTERFACE/user';
import { User, UserRepository } from '@USER/core';
import { AuthenticationService } from '@USER/service';
import {
  ifSuccess,
  pipeAsync,
  flatten,
  throwError,
  isBusinessNotFound,
  isInternalInvalid,
  isBusinessInvalid,
} from '@UTIL';

export namespace AuthenticationUsecase {
  const _getCredentials = (user: IUser): Try<IAuthentication.Credentials> => {
    return getTry({
      access_token: flatten(AuthenticationService.getAccessToken(user)),
      refresh_token: flatten(AuthenticationService.getRefreshToken(user)),
      id_token: flatten(AuthenticationService.getIdToken(user)),
    });
  };

  export const signIn: (
    body: IAuthentication.SignInBody,
  ) => Promise<
    Try<IAuthentication.Credentials> | IFailure.Business.Invalid
  > = async (body) => {
    const profile = await AuthenticationService.getOauthProfile(body);
    if (isBusinessInvalid(profile)) return profile;

    return pipeAsync(
      UserRepository.findOneByOauthProfile,

      // 사용자 생성
      (result) =>
        isBusinessNotFound(result)
          ? UserRepository.add(User.create(flatten(profile)))
          : result,

      ifSuccess((user: IUser) =>
        User.isInActive(user)
          ? UserRepository.update(User.activate(user))
          : getTry(user),
      ),

      ifSuccess((user: IUser) => _getCredentials(user)),

      (result) =>
        isInternalInvalid(result)
          ? throwError(HttpExceptionFactory('Unprocessable Entity'))
          : result,

      (result) =>
        isBusinessNotFound(result)
          ? throwError(HttpExceptionFactory('ISE'))
          : result,
    )(profile.data);
  };

  export const refresh: (
    refresh_token: string,
  ) => Promise<TryCatch<string, IFailure.Business.Invalid>> = pipeAsync(
    AuthenticationService.getRefreshTokenPayload,

    ifSuccess((data: IAuthentication.RefreshTokenPayload) =>
      UserRepository.findOne(data.id),
    ),

    ifSuccess(AuthenticationService.getAccessToken),

    (result) =>
      isBusinessNotFound(result) ? Failure.Business.InvalidToken : result,

    (result) =>
      isInternalInvalid(result)
        ? throwError(HttpExceptionFactory('Unprocessable Entity'))
        : result,
  );
}
