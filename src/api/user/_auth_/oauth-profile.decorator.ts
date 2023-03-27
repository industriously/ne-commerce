import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { OAUTH_PROFILE } from '../_constants_/oauth-profile.request-key';
import typia from 'typia';
import { IAuthentication } from '@INTERFACE/user';

export const OauthProfile = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    return typia.assertPrune<IAuthentication.OauthProfile>(
      ctx.switchToHttp().getRequest()[OAUTH_PROFILE],
    );
  },
);
