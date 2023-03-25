import { UserSchema } from '@INTERFACE/user';
import { IConnection } from '@nestia/fetcher';
import { SeedUser } from 'src/api/__tests__/seed';
import typia from 'typia';
import { getPublic } from './get_public_profile';

export namespace TestUsers {
  const testuser = typia.random<UserSchema.Aggregate>();

  export const test_get_public_profile = (connection: IConnection) => () => {
    it.each([SeedUser.vender_id, SeedUser.normal_id])(
      'If active user exists',

      getPublic.test_success(connection),
    );

    it.each([testuser.id, SeedUser.inActive_id])(
      'If active user not exists',
      getPublic.test_user_not_found(connection),
    );

    it.each(['1234', 'afaesew'])(
      'If user_id is not uuid type',
      getPublic.test_invalid_params(connection),
    );
  };
}
