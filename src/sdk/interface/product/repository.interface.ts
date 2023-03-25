import { IRepository } from './../common/repository.interface';
import { IProduct } from './schema.interface';

export interface IProductRepository extends IRepository<IProduct, string> {
  readonly findMany: (page: number) => Promise<IProduct[]>;
  readonly count: () => Promise<number>;
}
