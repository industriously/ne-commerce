import { IProduct } from '@INTERFACE/product';
import { HttpExceptionMessage } from '@COMMON/exception';
import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import { test_error, validator_invalid_token } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';
import { isUndefined } from '@UTIL';

export namespace update {
  const api = (
    connection: IConnection,
    token: string,
    product_id: string,
    body: IProduct.UpdateInput,
  ) => {
    const { host, headers } = connection;
    return products.update(
      {
        host,
        headers: {
          ...headers,
          Authorization: `bearer ${token}`,
        },
      },
      product_id,
      body,
    );
  };

  export const test_success =
    (connection: IConnection, token: string, product_id: string) =>
    async (body: IProduct.UpdateInput) => {
      const before = await products.findOne(connection, product_id);
      const input = { ...body };

      await api(connection, token, product_id, body);

      const after = await products.findOne(connection, product_id);

      if (!isUndefined(body.description)) {
        expect(after.description).toBe(body.description);
        input.description = before.description;
      }

      if (!isUndefined(body.name)) {
        expect(after.name).toBe(body.name);
        input.name = before.name;
      }

      if (!isUndefined(body.price)) {
        expect(after.price).toBe(body.price);
        input.price = before.price;
      }

      await api(connection, token, product_id, input); // 원상 복구
    };

  export const test_product_not_found = (
    connection: IConnection,
    token: string,
    body: IProduct.UpdateInput,
  ) =>
    test_error((id: string) => api(connection, token, id, body))((err) => {
      expect(err.status).toBe(HttpStatus.NOT_FOUND);
      expect(err.message).toBe(HttpExceptionMessage.NF);
    });

  export const test_permission_fail = (
    connection: IConnection,
    product_id: string,
    body: IProduct.UpdateInput,
  ) =>
    test_error((token: string) => api(connection, token, product_id, body))(
      (err) => {
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe(HttpExceptionMessage.FBD);
      },
    );

  export const test_invalid_token = (
    connection: IConnection,
    product_id: string,
    body: IProduct.UpdateInput,
  ) =>
    test_error((token: string) => api(connection, token, product_id, body))(
      validator_invalid_token,
    );
}
