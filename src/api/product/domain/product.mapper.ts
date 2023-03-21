import { IProduct } from '@INTERFACE/product';
import { Product } from '@PRISMA';

export namespace ProductMapper {
  export const toDomain = (model: Product): IProduct => {
    const {
      id,
      name,
      price,
      description,
      store_id,
      is_deleted,
      created_at,
      updated_at,
    } = model;
    return {
      id,
      name,
      price,
      description,
      store_id,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
      is_deleted,
    };
  };

  export const toSummary = (
    product: IProduct,
    store: IProduct.Store,
  ): IProduct.Summary => {
    const { id, name, price, description, created_at } = product;
    return {
      id,
      name,
      price,
      description,
      store,
      created_at,
    };
  };
  export const toDetail = (
    product: IProduct,
    store: IProduct.Store,
  ): IProduct.Detail => {
    const { id, name, price, description, is_deleted, created_at, updated_at } =
      product;
    return {
      id,
      name,
      price,
      description,
      is_deleted,
      created_at,
      updated_at,
      store,
    };
  };
}
