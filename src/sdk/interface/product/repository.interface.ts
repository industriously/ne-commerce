import { IRepository } from './../common/repository.interface';
import { IProduct } from './schema.interface';

export interface IProductRepository extends IRepository<IProduct, string> {
  readonly findMany: (page: number) => Promise<[IProduct[], number]>;
  readonly create: (input: IProduct.CreateInput) => Promise<IProduct>;
  readonly update: (
    product_id: string,
    input: IProduct.UpdateInput,
  ) => Promise<void>;
}
