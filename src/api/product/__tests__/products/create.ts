import { HttpStatus } from '@nestjs/common';
import { IProduct } from '@INTERFACE/product';
import { IConnection } from '@nestia/fetcher';
import { test_error, validator_invalid_token } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';
import typia from 'typia';
import { HttpExceptionMessage } from '@COMMON/exception';
import { prisma } from '@INFRA/DB';

export namespace create {
  const api = async (
    connection: IConnection,
    token: string,
    body: IProduct.CreateBody,
  ) => {
    const { host, headers } = connection;
    return products.create(
      {
        host,
        headers: {
          ...headers,
          Authorization: `bearer ${token}`,
        },
      },
      body,
    );
  };

  export const test_success =
    (connection: IConnection, token: string) =>
    async (body: IProduct.CreateBody) => {
      const product = await api(connection, token, body);

      typia.assertEquals(product);

      await prisma.product.delete({ where: { id: product.id } });
    };

  export const test_permission_fail = (
    connection: IConnection,
    body: IProduct.CreateBody,
  ) =>
    test_error((token: string) => api(connection, token, body))((err) => {
      expect(err.status).toBe(HttpStatus.FORBIDDEN);
      expect(err.message).toBe(HttpExceptionMessage.FBD);
    });

  export const test_invalid_token = (
    connection: IConnection,
    body: IProduct.CreateBody,
  ) =>
    test_error((token: string) => api(connection, token, body))(
      validator_invalid_token,
    );
}
