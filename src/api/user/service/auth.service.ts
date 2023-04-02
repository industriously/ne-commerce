import { Configuration } from '@INFRA/config';
import { ICredentials, IUser } from '@INTERFACE/user';
import { InvalidOauthProfile } from '@USER/core';
import jwt from 'jsonwebtoken';
import typia from 'typia';
import { GithubStrategy, GoogleStrategy } from '@USER/_oauth_';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { Failure, getTry } from '@COMMON/exception';

export namespace AuthenticationService {
  const {
    ACCESS_TOKEN_PRIVATE_KEY,
    ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_TOKEN_PRIVATE_KEY,
    REFRESH_TOKEN_PUBLIC_KEY,
  } = Configuration;

  const google = new GoogleStrategy();
  const github = new GithubStrategy();

  const _getGoogleProfile = async (code: string) => {
    const credentials = await google.authorize(code);
    const identity = await google.getIdentity(credentials);
    const { name, email, sub } = identity;
    return {
      sub,
      oauth_type: 'google',
      email,
      name,
    };
  };

  const _getGithubProfile = async (code: string) => {
    const credentials = await github.authorize(code);
    const identity = await github.getIdentity(credentials);
    const { login: name, email, id } = identity;
    return {
      sub: id + '',
      oauth_type: 'github',
      email,
      name,
    };
  };

  export const getOauthProfile: (
    body: ICredentials.SignInBody,
  ) => Promise<TryCatch<IUser.ICreate, IFailure.Business.Invalid>> = async (
    body,
  ) => {
    const { code, oauth_type } = body;
    const profile = await (oauth_type === 'google'
      ? _getGoogleProfile(code)
      : _getGithubProfile(code));

    return typia.isPrune<IUser.ICreate>(profile)
      ? getTry(profile)
      : InvalidOauthProfile;
  };

  export const getAccessToken = (user: IUser): Try<string> => {
    const payload = {
      id: user.id,
      type: user.type,
    } satisfies ICredentials.IAccessTokenPayload;
    return getTry(
      jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: '8h',
        algorithm: 'RS256',
      }),
    );
  };

  export const getAccessTokenPayload = (
    token: string,
  ): TryCatch<ICredentials.IAccessTokenPayload, IFailure.Business.Invalid> => {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      if (typia.isPrune<ICredentials.IAccessTokenPayload>(payload))
        return getTry(payload);
    } catch (error) {}
    return Failure.Business.InvalidToken;
  };

  export const getRefreshToken = (user: IUser): Try<string> => {
    const payload = {
      id: user.id,
      type: user.type,
    } satisfies ICredentials.IRefreshTokenPayload;
    return getTry(
      jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: '30w',
        algorithm: 'RS256',
      }),
    );
  };

  export const getRefreshTokenPayload = (
    token: string,
  ): TryCatch<ICredentials.IRefreshTokenPayload, IFailure.Business.Invalid> => {
    try {
      const payload = jwt.verify(token, REFRESH_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      if (typia.isPrune<ICredentials.IRefreshTokenPayload>(payload))
        return getTry(payload);
    } catch (error) {}
    return Failure.Business.InvalidToken;
  };

  export const getIdToken = (user: IUser): Try<string> => {
    const payload = user;
    return getTry(
      jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: '1d',
        algorithm: 'RS256',
      }),
    );
  };

  export const getIdTokenPayload = (
    token: string,
  ): TryCatch<ICredentials.IIdTokenPayload, IFailure.Business.Invalid> => {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      if (typia.isPrune<ICredentials.IIdTokenPayload>(payload))
        return getTry(payload);
    } catch (error) {}
    return Failure.Business.InvalidToken;
  };
}
