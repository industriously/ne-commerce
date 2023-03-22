import { PaginatedResponse } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';

export interface IProductUsecase {
  readonly findOne: (product_id: string) => Promise<IProduct.Detail>;
  readonly findMany: (
    page: number,
  ) => Promise<PaginatedResponse<IProduct.Summary>>;
  readonly create: (token: string, input: IProduct.CreateBody) => Promise<void>;
  readonly update: (
    token: string,
    product_id: string,
    input: IProduct.UpdateInput,
  ) => Promise<void>;
  readonly inActivate: (token: string, product_id: string) => Promise<void>;
}
