import { GoogleStrategy } from './../_auth_/strategy/google.strategy';
import { Configuration } from '@INFRA/config';
import { IAuthentication } from '@INTERFACE/user';
import { IUser } from '@INTERFACE/user';
import { User } from '@USER/core';
import jwt from 'jsonwebtoken';
import typia from 'typia';
import { GithubStrategy } from '@USER/_auth_';
import { TryCatch } from '@INTERFACE/common';
import { Exception, getSuccessReturn } from '@COMMON/exception';

export namespace AuthenticationService {
  const {
    ACCESS_TOKEN_PRIVATE_KEY,
    ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_TOKEN_PRIVATE_KEY,
    REFRESH_TOKEN_PUBLIC_KEY,
  } = Configuration;

  const google = new GoogleStrategy();
  const github = new GithubStrategy();

  const getGoogleProfile = async (code: string) => {
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

  const getGithubProfile = async (code: string) => {
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

  export const getOauthProfile = async (
    body: IAuthentication.SignInBody,
  ): Promise<IAuthentication.OauthProfile> => {
    const { oauth_type, code } = body;
    const oauthProfile =
      oauth_type === 'google' ? getGoogleProfile(code) : getGithubProfile(code);
    return typia.assertPrune<IAuthentication.OauthProfile>(oauthProfile);
  };

  export const getAccessToken = (user: IUser): string => {
    const payload = {
      id: user.id,
      role: user.role,
    } satisfies IAuthentication.AccessTokenPayload;
    return jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '8h',
      algorithm: 'RS256',
    });
  };
  export const getAccessTokenPayload = (
    token: string,
  ): TryCatch<
    IAuthentication.AccessTokenPayload,
    typeof Exception.INVALID_TOKEN
  > => {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      if (typia.isPrune<IAuthentication.AccessTokenPayload>(payload)) {
        return getSuccessReturn(payload);
      }
    } catch (error) {}
    return Exception.INVALID_TOKEN;
  };

  export const getRefreshToken = (user: IUser): string => {
    const payload = {
      id: user.id,
    } satisfies IAuthentication.RefreshTokenPayload;
    return jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: '30w',
      algorithm: 'RS256',
    });
  };
  export const getRefreshTokenPayload = (
    token: string,
  ): TryCatch<
    IAuthentication.RefreshTokenPayload,
    typeof Exception.INVALID_TOKEN
  > => {
    try {
      const payload = jwt.verify(token, REFRESH_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      if (typia.isPrune<IAuthentication.RefreshTokenPayload>(payload)) {
        return getSuccessReturn(payload);
      }
    } catch (error) {}
    return Exception.INVALID_TOKEN;
  };

  export const getIdToken = (user: IUser): string => {
    const payload = User.toDetail(user);
    return jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '1d',
      algorithm: 'RS256',
    });
  };
  export const getIdTokenPayload = (
    token: string,
  ): TryCatch<
    IAuthentication.IdTokenPayload,
    typeof Exception.INVALID_TOKEN
  > => {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      if (typia.isPrune<IAuthentication.IdTokenPayload>(payload)) {
        return getSuccessReturn(payload);
      }
    } catch (error) {}
    return Exception.INVALID_TOKEN;
  };
}
