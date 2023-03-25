import { UserSchema } from '@INTERFACE/user';
import { SeedUser } from 'src/api/__tests__/seed/user';
import { IConnection } from '@nestia/fetcher';
import { refresh } from './refresh';
import { tokenService } from 'src/api/__tests__/mock/provider';
import { AccessToken } from 'src/api/__tests__/seed';

export namespace TestAuth {
  export const test_refresh = (connection: IConnection) => () => {
    it.each(AccessToken.invalid_list)(
      'If token invalid',
      refresh.test_invalid_token(connection),
    );

    it.each(
      ['182ea22d-88f4-442b-a889-932132cf40a0', SeedUser.inActive_id].map((id) =>
        tokenService.getRefreshToken({ id } as UserSchema.Aggregate),
      ),
    )('If user not exist', refresh.test_user_not_exist(connection));

    it.each(
      [SeedUser.vender_id, SeedUser.normal_id].map((id) =>
        tokenService.getRefreshToken({ id } as UserSchema.Aggregate),
      ),
    )('If user exist', refresh.test_success(connection));
  };
}
