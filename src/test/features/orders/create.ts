import { IFailure, Try } from '@INTERFACE/common';
import { IOrder, IUnpaidOrder } from '@INTERFACE/order';
import { ArrayUtil } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { InvalidOrderItem } from '@ORDER/core';
import { Product } from '@PRODUCT/core';
import { orders } from '@SDK/index';
import { getConnectionWithToken, invalid_token } from '@test/internal';
import { AccessToken, SeedProduct } from '@test/seed';
import assert from 'assert';
import typia from 'typia';

const api =
  (body: IOrder.ICreateBody) => (connection: IConnection) => (token: string) =>
    orders.create(getConnectionWithToken(connection, token), body);

const randomRecipient = typia.createRandom<IOrder.IRecipient>();

console.log();

export const test_orders_create_success = async (connection: IConnection) => {
  const body = {
    recipient: randomRecipient(),
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

export const test_orders_create_invalid_token = invalid_token(
  api(typia.random<IOrder.ICreateBody>()),
);

export const test_orders_create_invalid_order_item = async (
  connection: IConnection,
) => {
  const test_bodys = [
    {
      recipient: randomRecipient(),
      order_item_list: [
        {
          product_id: SeedProduct.product1,
          quantity: 2,
        },
        {
          product_id: SeedProduct.inActive_product,
          quantity: 1,
        },
      ],
    },
    {
      recipient: randomRecipient(),
      order_item_list: [
        {
          product_id: SeedProduct.product2,
          quantity: 2,
        },
        {
          product_id: Product.randomId(),
          quantity: 1,
        },
      ],
    },
  ];
  const received = await ArrayUtil.asyncMap(test_bodys, (body) =>
    api(body)(connection)(AccessToken.customer),
  );

  typia.assertEquals<IFailure.Business.Invalid[]>(received);

  received.forEach((result) =>
    assert.deepStrictEqual(result, InvalidOrderItem),
  );
};
