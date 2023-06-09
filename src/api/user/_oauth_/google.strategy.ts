import { OAUTH_PROFILE } from './oauth-profile.request-key';
import { IUser } from '@INTERFACE/user';
import { Google, Request, StrategyException } from '@devts/nestjs-auth';
import { Configuration } from '@INFRA/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import typia from 'typia';

@Injectable()
export class GoogleStrategy extends Google.AbstractStrategy<
  typeof OAUTH_PROFILE,
  'email' | 'profile',
  IUser.ICreate
> {
  constructor() {
    super({
      key: 'profile',
      client_id: Configuration.GOOGLE_CLIENT_ID,
      client_secret: Configuration.GOOGLE_CLIENT_SECRET,
      redirect_uri: Configuration.GOOGLE_OAUTH_CALLBACK,
      access_type: 'offline',
      prompt: 'select_account',
      scope: ['email', 'profile'],
    });
  }

  protected override throw({
    message = '사용자 인증에 실패했습니다.',
  }: StrategyException): never {
    throw new UnauthorizedException(message);
  }

  override getCode(request: Request): string {
    const code = (request.body as any).code;
    if (typeof code !== 'string') {
      this.throw({ message: 'code not found' });
    }
    return code;
  }

  validate(identity: Google.IdToken<'email' | 'profile'>): boolean {
    if (!typia.is(identity)) {
      this.throw({ message: '사용자 정보가 충분하지 않습니다.' });
    }
    return true;
  }

  transform(identity: Google.IdToken<'email' | 'profile'>): IUser.ICreate {
    const { name, email, sub } = identity;
    return {
      name,
      email,
      sub,
      oauth_type: 'google',
    } satisfies IUser.ICreate;
  }
}
