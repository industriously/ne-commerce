import { IUser } from './user.interface';

export interface ICredentials {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly id_token: string;
}

export namespace ICredentials {
  export type IAccessTokenPayload = Pick<IUser, 'id' | 'type'>;
  export type IRefreshTokenPayload = Pick<IUser, 'id' | 'type'>;
  export type IIdTokenPayload = IUser;

  export interface SignInBody {
    readonly oauth_type: IUser.OauthType;
    readonly code: string;
  }
}
