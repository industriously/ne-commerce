import { OAUTH_PROFILE } from '@USER/_constants_';
import { Github, Request, StrategyException } from '@devts/nestjs-auth';
import { IAuthentication } from '@INTERFACE/user';
import { Injectable } from '@nestjs/common';
import { HttpExceptionFactory } from '@COMMON/exception';
import { Configuration } from '@INFRA/config';
import typia from 'typia';

@Injectable()
export class GithubStrategy extends Github.AbstractStrategy<
  typeof OAUTH_PROFILE,
  IAuthentication.OauthProfile
> {
  constructor() {
    super({
      key: 'profile',
      client_id: Configuration.GITHUB_CLIENT_ID,
      client_secret: Configuration.GITHUB_CLIENT_SECRET,
      redirect_uri: Configuration.GITHUB_OAUTH_CALLBACK,
      scope: ['read:user', 'user:email'],
    });
  }

  protected override throw({
    message = '사용자 인증에 실패했습니다.',
  }: StrategyException): never {
    throw HttpExceptionFactory('UnAuthorized', message);
  }

  override getCode(request: Request): string {
    const code = (request.body as any).code;
    if (typeof code !== 'string') {
      this.throw({ message: 'code not found' });
    }
    return code;
  }

  validate(identity: Github.User): boolean {
    if (!typia.is<Github.User & { email: string }>(identity)) {
      this.throw({ message: '사용자 정보가 충분하지 않습니다.' });
    }
    return true;
  }

  transform(
    identity: Github.User & { email: string },
  ): IAuthentication.OauthProfile {
    const { login: name, email, id } = identity;
    return {
      name,
      email,
      sub: id + '',
      oauth_type: 'github',
    } satisfies IAuthentication.OauthProfile;
  }
}
