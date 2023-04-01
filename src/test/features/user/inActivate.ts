import { user } from '@SDK/index';
import { IConnection } from '@nestia/fetcher';
import { getAuthorization } from '../util/get_authorization';
import { ArrayUtil } from '@nestia/e2e';
import { AccessToken, SeedUser } from '@test/seed';
import assert from 'assert';
import { prisma } from '@INFRA/DB';
import { invalid_token } from '@test/internal';

const api = (connection: IConnection) => (token: string) =>
  user.inActivate({
    host: connection.host,
    headers: {
      ...connection.headers,
      Authorization: getAuthorization(token),
    },
  });

console.log('  - --');

export const test_user_inActivate_success = async (connection: IConnection) => {
  const received = await ArrayUtil.asyncMap(
    [AccessToken.normal, AccessToken.vender, AccessToken.vender2],
    api(connection),
  );
  received.forEach((result) =>
    assert.deepStrictEqual(result, { type: 'success', data: true }),
  );

  // reset
  await prisma.user.updateMany({
    where: {
      id: { in: [SeedUser.normal_id, SeedUser.vender_id, SeedUser.vender2_id] },
    },
    data: { is_deleted: false },
  });
};

export const test_user_inActivate_invalid_token = invalid_token(api);
