import { Try } from '@INTERFACE/common';
import { IOrder, IUnpaidOrder } from '@INTERFACE/order';
import { IConnection } from '@nestia/fetcher';
import { orders } from '@SDK/index';
import { getConnectionWithToken } from '@test/internal';
import { AccessToken, SeedProduct } from '@test/seed';
import typia from 'typia';

const api =
  (body: IOrder.ICreateBody) => (connection: IConnection) => (token: string) =>
    orders.create(getConnectionWithToken(connection, token), body);

console.log();

export const test_orders_create_success = async (connection: IConnection) => {
  const body = {
    recipient: typia.random<IOrder.IRecipient>(),
    order_item_list: [
      {
        product_id: SeedProduct.product1,
        quantity: 2,
      },
      {
        product_id: SeedProduct.product2,
        quantity: 1,
      },
      {
        product_id: SeedProduct.product3,
        quantity: 3,
      },
    ],
  } satisfies IOrder.ICreateBody;
  const received = await api(body)(connection)(AccessToken.customer);

  typia.assertEquals<Try<IUnpaidOrder>>(received);
};
