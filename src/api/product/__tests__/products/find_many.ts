import { HttpStatus } from '@nestjs/common';
import { IConnection } from '@nestia/fetcher';
import { test_error } from 'src/api/__tests__/common';
import { products } from 'src/sdk/functional';
import typia from 'typia';

export namespace findMany {
  const api = (connection: IConnection) => (page?: number) => {
    return products.findMany(connection, page);
  };

  export const test_success =
    (connection: IConnection) => async (page?: number) => {
      const received = await api(connection)(page);
      typia.assertEquals(received);
    };

  export const test_not_int = (connection: IConnection) =>
    test_error((page: number) => api(connection)(page))((err) => {
      expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      expect(err.message).toBe("Value of the URL query 'page' is invalid.");
    });
}
