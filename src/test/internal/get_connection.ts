import { IConnection } from '@nestia/fetcher';
import { getAuthorization } from '@test/internal/get_authorization';

export const getConnectionWithToken = (
  connection: IConnection,
  token: string,
): IConnection => ({
  host: connection.host,
  headers: {
    ...connection.headers,
    Authorization: getAuthorization(token),
  },
});
