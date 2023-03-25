import { HttpExceptionMessage } from '@COMMON/exception';
import { prisma } from '@INFRA/DB';
import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import { test_error, validator_invalid_token } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';

export namespace inActivate {
  const api = (connection: IConnection, token: string, product_id: string) => {
    const { host, headers } = connection;
    return products.inActivate(
      {
        host,
        headers: {
          ...headers,
          Authorization: `bearer ${token}`,
        },
      },
      product_id,
    );
  };

  export const test_success =
    (connection: IConnection, token: string) => async (product_id: string) => {
      await api(connection, token, product_id);

      const product = await prisma.product.findUniqueOrThrow({
        where: { id: product_id },
      });
      expect(product.is_deleted).toBe(true);

      await prisma.product.update({
        where: { id: product_id },
        data: { is_deleted: false },
      });
    };

  export const test_product_not_found = (
    connection: IConnection,
    token: string,
  ) =>
    test_error((product_id: string) => api(connection, token, product_id))(
      (err) => {
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe(HttpExceptionMessage.NF);
      },
    );

  export const test_permission_fail = (
    connection: IConnection,
    product_id: string,
  ) =>
    test_error((token: string) => api(connection, token, product_id))((err) => {
      expect(err.status).toBe(HttpStatus.FORBIDDEN);
      expect(err.message).toBe(HttpExceptionMessage.FBD);
    });

  export const test_invalid_token = (
    connection: IConnection,
    product_id: string,
  ) =>
    test_error((token: string) => api(connection, token, product_id))(
      validator_invalid_token,
    );
}
