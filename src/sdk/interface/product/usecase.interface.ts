import { PaginatedResponse } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';

export interface IProductUsecase {
  readonly findOne: (product_id: string) => Promise<IProduct.Detail>;
  readonly findMany: (
    page: number,
  ) => Promise<PaginatedResponse<IProduct.Summary>>;
  readonly create: (input: IProduct.CreateInput) => Promise<void>;
  readonly update: (
    product_id: string,
    input: IProduct.UpdateInput,
  ) => Promise<void>;
  readonly inActivate: (product_id: string) => Promise<void>;
}
