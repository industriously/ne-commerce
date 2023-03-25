import { DBClientToken } from '@INFRA/DB';
import { Provider } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TokenServiceToken } from '@TOKEN';
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
    inject: [CommandBus, ProductRepositoryToken, TokenServiceToken],
    useFactory: ProductUsecaseFactory,
  },
];
