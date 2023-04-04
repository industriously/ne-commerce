import { IConnection } from '@nestia/fetcher';
import { orders } from '@SDK/index';
import { getConnectionWithToken } from '@test/internal';

const api = (connection: IConnection) => (token: string) =>
  orders.findMany(getConnectionWithToken(connection, token));
