import { prisma } from '@INFRA/DB';
import { Try } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { IConnection } from '@nestia/fetcher';
import { ForbiddenCreateProduct } from '@PRODUCT/core';
import { products } from '@SDK/index';
import { getConnectionWithToken, invalid_token } from '@test/internal';
import { AccessToken } from '@test/seed';
import assert from 'assert';
import typia from 'typia';

const api =
  (body: IProduct.CreateInput) =>
  (connection: IConnection) =>
  (token: string) =>
    products.create(getConnectionWithToken(connection, token), body);

const randomBody = typia.createRandom<IProduct.CreateInput>();

console.log();

export const test_products_create_success = async (connection: IConnection) => {
  const received = await api(randomBody())(connection)(AccessToken.vender);

  const {
    data: { id },
  } = typia.assertEquals<Try<IProduct.Detail>>(received);

  await prisma.product.delete({ where: { id } });
};

export const test_products_create_invalid_token = invalid_token(
  api(randomBody()),
);

export const test_products_create_forbidden_create_product = async (
  connection: IConnection,
) => {
  const received = await api(randomBody())(connection)(AccessToken.normal);

  assert.deepStrictEqual(received, ForbiddenCreateProduct);
};
