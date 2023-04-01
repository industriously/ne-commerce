import { IConnection } from '@nestia/fetcher';
import { getAuthorization } from '../util/get_authorization';
import { AccessToken } from '../../../test/seed';
import typia from 'typia';
import { Try } from '@INTERFACE/common';
import { ArrayUtil } from '@nestia/e2e';
import { user } from '@SDK/index';
import { invalid_token } from '@test/internal';
import { IUser } from '@INTERFACE/user';

const api = (connection: IConnection) => (token: string) =>
  user.getDetail({
    host: connection.host,
    headers: {
      ...connection.headers,
      Authorization: getAuthorization(token),
    },
  });

console.log('  - --');

/**
 * 내 정보 요청 - 성공
 */
export const test_user_get_detail_success = async (connection: IConnection) => {
  const received = await ArrayUtil.asyncMap(
    [AccessToken.normal, AccessToken.vender, AccessToken.vender2],
    api(connection),
  );
  typia.assertEquals<Try<IUser.Detail>[]>(received);
};

/**
 * 내 정보 요청 - 유효하지 않은 토큰 사용
 */
export const test_user_get_detail_invalid_token = invalid_token(api);
