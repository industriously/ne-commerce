import { IProduct } from '@INTERFACE/product';

export namespace ProductMapper {
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
