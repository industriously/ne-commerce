import { Try } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import {
  ForbiddenUpdateProduct,
  NotFoundProduct,
  Product,
} from '@PRODUCT/core';
import { products } from '@SDK/index';
import { isUndefined } from '@UTIL';
import { ArrayUtil } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { getConnectionWithToken, invalid_token } from '@test/internal';
import { AccessToken, SeedProduct } from '@test/seed';
import assert from 'assert';
import typia from 'typia';

const api =
  (product_id: string) =>
  (body: IProduct.UpdateInput) =>
  (connection: IConnection) =>
  (token: string) =>
    products.update(
      getConnectionWithToken(connection, token),
      product_id,
      body,
    );

const getBody = typia.createRandom<IProduct.UpdateInput>();

console.log();

export const test_products_update_success = (connection: IConnection) =>
  ArrayUtil.asyncRepeat(10, async () => {
    const body = getBody();
    const { data: product } = typia.assertEquals<Try<IProduct.Detail>>(
      await api(SeedProduct.product1)(body)(connection)(AccessToken.vender),
    );

    for (const [key, value] of Object.entries(body)) {
      if (!isUndefined(value))
        assert.deepStrictEqual(
          product[key as keyof IProduct.UpdateInput],
          value,
        );
    }
  });

export const test_products_update_invalid_token = invalid_token(
  api(SeedProduct.product1)(getBody()),
);

export const test_products_update_not_found = async (
  connection: IConnection,
) => {
  const received = await ArrayUtil.asyncMap(
    [Product.randomId(), SeedProduct.inActive_product],
    (id) => api(id)(getBody())(connection)(AccessToken.vender),
  );
  received.forEach((ex) => assert.deepStrictEqual(ex, NotFoundProduct));
};

export const test_products_update_forbidden_update_product = async (
  connection: IConnection,
) => {
  const ids = [
    SeedProduct.product1,
    SeedProduct.product2,
    SeedProduct.product3,
  ];
  const received1 = await ArrayUtil.asyncMap(ids, (id) =>
    api(id)(getBody())(connection)(AccessToken.vender2),
  );
  const received2 = await ArrayUtil.asyncMap(ids, (id) =>
    api(id)(getBody())(connection)(AccessToken.normal),
  );

  received1.forEach((ex) => assert.deepStrictEqual(ex, ForbiddenUpdateProduct));
  received2.forEach((ex) => assert.deepStrictEqual(ex, ForbiddenUpdateProduct));
};
