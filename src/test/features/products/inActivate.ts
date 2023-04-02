import { prisma } from '@INFRA/DB';
import { Try } from '@INTERFACE/common';
import {
  ForbiddenUpdateProduct,
  NotFoundProduct,
  Product,
} from '@PRODUCT/core';
import { products } from '@SDK/index';
import { ArrayUtil } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { getConnectionWithToken, invalid_token } from '@test/internal';
import { AccessToken, SeedProduct } from '@test/seed';
import assert from 'assert';
import typia from 'typia';

const api =
  (product_id: string) => (connection: IConnection) => (token: string) =>
    products.inActivate(getConnectionWithToken(connection, token), product_id);

console.log('  - --');

export const test_products_inActivate_success = async (
  connection: IConnection,
) => {
  const ids = [
    SeedProduct.product1,
    SeedProduct.product2,
    SeedProduct.product3,
  ];
  const received = await ArrayUtil.asyncMap(ids, (id) =>
    api(id)(connection)(AccessToken.vender),
  );

  typia.assertEquals<Try<true>[]>(received);

  await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { is_deleted: false },
  });
};

export const test_products_inActivate_invalid_token = invalid_token(
  api(SeedProduct.product1),
);

export const test_products_inActivate_not_found = async (
  connection: IConnection,
) => {
  const received = await ArrayUtil.asyncMap(
    [Product.randomId(), SeedProduct.inActive_product],
    (id) => api(id)(connection)(AccessToken.vender),
  );
  received.forEach((ex) => assert.deepStrictEqual(ex, NotFoundProduct));
};

export const test_products_inActivate_forbidden_update_product = async (
  connection: IConnection,
) => {
  const ids = [
    SeedProduct.product1,
    SeedProduct.product2,
    SeedProduct.product3,
  ];
  const received1 = await ArrayUtil.asyncMap(ids, (id) =>
    api(id)(connection)(AccessToken.vender2),
  );
  const received2 = await ArrayUtil.asyncMap(ids, (id) =>
    api(id)(connection)(AccessToken.customer),
  );

  received1.forEach((ex) => assert.deepStrictEqual(ex, ForbiddenUpdateProduct));
  received2.forEach((ex) => assert.deepStrictEqual(ex, ForbiddenUpdateProduct));
};
