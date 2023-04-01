import { PaginatedResponse, Try } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { products } from '@SDK/index';
import { IConnection } from '@nestia/fetcher';
import typia from 'typia';

const api = (connection: IConnection) => (page?: number) =>
  products.findMany(connection, page);

console.log();

export const test_products_findMany_success = async (
  connection: IConnection,
) => {
  const received = await api(connection)(1);

  typia.assertEquals<Try<PaginatedResponse<IProduct.Summary>>>(received);
};
