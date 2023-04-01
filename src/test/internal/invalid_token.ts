import { Failure } from '@COMMON/exception';
import { IUser } from '@INTERFACE/user';
import { AuthenticationService } from '@USER/service';
import { ArrayUtil } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { AccessToken, SeedUser } from '@test/seed';
import assert from 'assert';

export const invalid_token =
  (api: (connection: IConnection) => (token: string) => Promise<unknown>) =>
  async (connection: IConnection) => {
    const received = await ArrayUtil.asyncMap(
      [
        AuthenticationService.getAccessToken({
          id: SeedUser.inActive_id,
        } as IUser).data,
        AuthenticationService.getRefreshToken({
          id: SeedUser.inActive_id,
        } as IUser).data,
        ...AccessToken.invalid_list,
      ],
      api(connection),
    );
    received.forEach((ex) =>
      assert.deepStrictEqual(ex, Failure.Business.InvalidToken),
    );
  };
