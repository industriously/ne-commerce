import { IProduct } from '@INTERFACE/product';
import { Product } from '@PRISMA';

export namespace ProductMapper {
  export const toDomain = (model: Product): IProduct => {
    const {
      id,
      code,
      name,
      price,
      description,
      vender_id,
      is_deleted,
      created_at,
      updated_at,
    } = model;
    return {
      id,
      code,
      name,
      price,
      description,
      vender_id,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
      is_deleted,
    };
  };

  export const toSummary = (
    product: IProduct,
    vender: IProduct.Vender,
  ): IProduct.Summary => {
    const { id, name, price, description, created_at } = product;
    return {
      id,
      name,
      price,
      vender,
      description,
      created_at,
    };
  };
  export const toDetail = (
    product: IProduct,
    vender: IProduct.Vender,
  ): IProduct.Detail => {
    const { id, name, price, description, is_deleted, created_at, updated_at } =
      product;
    return {
      id,
      name,
      price,
      vender,
      description,
      is_deleted,
      created_at,
      updated_at,
    };
  };
}
