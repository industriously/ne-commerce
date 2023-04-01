import { IUser } from '@INTERFACE/user';
import { user } from '@SDK/index';
import { IConnection } from '@nestia/fetcher';
import { getAuthorization } from '../util/get_authorization';
import { ArrayUtil } from '@nestia/e2e';
import typia from 'typia';
import { AccessToken } from '@test/seed';
import { Try } from '@INTERFACE/common';
import { isUndefined } from '@UTIL';
import assert from 'node:assert';
import { invalid_token } from '@test/internal';

const api =
  (body: IUser.UpdateInput) => (connection: IConnection) => (token: string) =>
    user.update(
      {
        host: connection.host,
        headers: {
          ...connection.headers,
          Authorization: getAuthorization(token),
        },
      },
      body,
    );

const getBody = typia.createRandom<IUser.UpdateInput>();

console.log('  - --');

/**
 * 내 프로필 정보 수정 - 성공
 */
export const test_user_update_success = (connection: IConnection) =>
  ArrayUtil.asyncRepeat(10, async () => {
    const body = getBody();
    const received = await api(body)(connection)(AccessToken.normal);

    const { data: user } = typia.assertEquals<Try<IUser.Detail>>(received);
    for (const [key, value] of Object.entries(body)) {
      if (!isUndefined(value))
        assert.deepStrictEqual(user[key as keyof IUser.UpdateInput], value);
    }
  });

export const test_user_update_invalid_token = invalid_token(api(getBody()));
