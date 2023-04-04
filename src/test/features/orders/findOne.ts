import { IConnection } from '@nestia/fetcher';
import { orders } from '@SDK/index';
import { getConnectionWithToken } from '@test/internal';

const api =
  (order_id: string) => (connection: IConnection) => (token: string) =>
    orders.findOne(getConnectionWithToken(connection, token), order_id);
