import { DBClientToken } from '@INFRA/DB';
import { Provider } from '@nestjs/common';
import { ProductUsecaseFactory } from './application';
import { ProductRepositoryToken, ProductUsecaseToken } from './constants';
import { ProductRepositoryFactory } from './infrastructure';

export const providers: Provider[] = [
  {
    provide: ProductRepositoryToken,
    inject: [DBClientToken],
    useFactory: ProductRepositoryFactory,
  },
  {
    provide: ProductUsecaseToken,
    inject: [ProductRepositoryToken],
    useFactory: ProductUsecaseFactory,
  },
];
