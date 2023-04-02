import { IConnection } from '@nestia/fetcher';
import { refresh } from '@SDK/token';
import { getAuthorization } from '../../internal/get_authorization';
import { SeedUser } from '../../../test/seed';
import typia from 'typia';
import { Try } from '@INTERFACE/common';
import { AuthenticationService } from '@USER/service';
import { ICredentials, IUser } from '@INTERFACE/user';
import { ArrayUtil } from '@nestia/e2e';
import { invalid_token } from '@test/internal';

const api = (connection: IConnection) => (token: string) =>
  refresh.refreshToken({
    host: connection.host,
    headers: {
      ...connection.headers,
      Authorization: getAuthorization(token),
    },
  });

console.log('  - --');

// success case
export const test_token_refresh_refreshToken_success = (
  connection: IConnection,
) =>
  ArrayUtil.asyncForEach(
    [SeedUser.customer_id, SeedUser.vender_id, SeedUser.vender2_id],
    async (id) => {
      const refresh_token = AuthenticationService.getRefreshToken({
        id,
        type: 'customer',
      } as IUser).data;
      const result = await api(connection)(refresh_token);
      const { data: token } = typia.assertEquals<Try<string>>(result);

      const received = AuthenticationService.getAccessTokenPayload(token);
      const { data: payload } =
        typia.assertEquals<Try<ICredentials.IAccessTokenPayload>>(received);

      if (payload.id !== id) {
        throw Error('사용자의 토큰을 생성하지 못했습니다.');
      }
    },
  );

// fail case
export const test_token_refresh_refreshToken_business_invalid =
  invalid_token(api);
