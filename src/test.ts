import { IProduct } from '@INTERFACE/product';
import typia from 'typia';
import { create } from './sdk/functional/products';

new Array(100)
  .fill(1)
  .forEach(() =>
    create(
      { host: 'http://localhost:4000' },
      typia.random<IProduct.CreateInput>(),
    ),
  );
