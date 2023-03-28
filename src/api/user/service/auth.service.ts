import { HttpExceptionFactory } from '@COMMON/exception';
import { Configuration } from '@INFRA/config';
import { IAuthentication } from '@INTERFACE/user';
import { FunctionType } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { User } from '@USER/core';
import jwt from 'jsonwebtoken';
import typia from 'typia';

export namespace AuthenticationService {
  const {
    ACCESS_TOKEN_PRIVATE_KEY,
    ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_TOKEN_PRIVATE_KEY,
    REFRESH_TOKEN_PUBLIC_KEY,
  } = Configuration;

  const _throwThen =
    <F extends FunctionType>(fn: F) =>
    (...args: Parameters<F>): ReturnType<F> => {
      try {
        return fn(...args);
      } catch (error) {
        throw HttpExceptionFactory('BadRequest', '잘못된 토큰입니다.');
      }
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
  export const getAccessTokenPayload = _throwThen(
    (token: string): IAuthentication.AccessTokenPayload => {
      const payload = jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      return typia.assertPrune<IAuthentication.AccessTokenPayload>(payload);
    },
  );

  export const getRefreshToken = (user: IUser): string => {
    const payload = {
      id: user.id,
    } satisfies IAuthentication.RefreshTokenPayload;
    return jwt.sign(payload, REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: '30w',
      algorithm: 'RS256',
    });
  };
  export const getRefreshTokenPayload = _throwThen(
    (token: string): IAuthentication.RefreshTokenPayload => {
      const payload = jwt.verify(token, REFRESH_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      return typia.assertPrune<IAuthentication.RefreshTokenPayload>(payload);
    },
  );

  export const getIdToken = (user: IUser): string => {
    const payload = User.toDetail(user);
    return jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '1d',
      algorithm: 'RS256',
    });
  };
  export const getIdTokenPayload = _throwThen(
    (token: string): IAuthentication.IdTokenPayload => {
      const payload = jwt.verify(token, ACCESS_TOKEN_PUBLIC_KEY, {
        complete: false,
      });
      return typia.assertPrune<IAuthentication.IdTokenPayload>(payload);
    },
  );
}
