import { HttpExceptionMessage } from '@COMMON/exception';
import { HttpStatus } from '@nestjs/common';
import { IConnection } from '@nestia/fetcher';
import { test_error } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';
import typia from 'typia';

export namespace findOne {
  const api = (connection: IConnection) => (product_id: string) => {
    return products.findOne(connection, product_id);
  };

  export const test_success =
    (connection: IConnection) => async (product_id: string) => {
      const received = await api(connection)(product_id);
      typia.assertEquals(received);
    };

  export const test_product_not_found = (connection: IConnection) =>
    test_error(api(connection))((err) => {
      expect(err.status).toBe(HttpStatus.NOT_FOUND);
      expect(err.message).toBe(HttpExceptionMessage.NF);
    });
}
