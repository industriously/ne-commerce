import { Try } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { NotFoundProduct, Product } from '@PRODUCT/core';
import { products } from '@SDK/index';
import { ArrayUtil } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { SeedProduct } from '@test/seed';
import assert from 'assert';
import typia from 'typia';

const api = (connection: IConnection) => (product_id: string) =>
  products.findOne(connection, product_id);

console.log('  - --');

export const test_products_findOne_success = async (
  connection: IConnection,
) => {
  const received = await ArrayUtil.asyncMap(
    [SeedProduct.product1, SeedProduct.product2, SeedProduct.product3],
    api(connection),
  );

  typia.assertEquals<Try<IProduct.Detail>[]>(received);
};

export const test_products_findOne_not_found = async (
  connection: IConnection,
) => {
  const received = await ArrayUtil.asyncMap(
    [Product.randomId(), SeedProduct.inActive_product],
    api(connection),
  );
  received.forEach((ex) => assert.deepStrictEqual(ex, NotFoundProduct));
};
