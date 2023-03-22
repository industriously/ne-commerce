import { IProduct } from '@INTERFACE/product';
import { Predicate } from '@UTIL';
import typia from 'typia';

export namespace Product {
  export const create = (input: IProduct.CreateInput): IProduct => {
    const { id, store_id, name, description, price } = typia.assert(input);
    const now = new Date().toISOString();
    return {
      id,
      name,
      description,
      price,
      store_id,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
  };
  export const update = (target: IProduct, input: IProduct.UpdateInput) => {
    (target.name as string) = input.name ?? target.name;
    (target.description as string) = input.description ?? target.description;
    (target.price as number) = input.price ?? target.price;
    (target.updated_at as string) = new Date().toISOString();
    return target;
  };

  export const activate = (target: IProduct) => {
    (target.is_deleted as boolean) = false;
    (target.updated_at as string) = new Date().toISOString();
    return target;
  };

  export const inActivate = (target: IProduct) => {
    (target.is_deleted as boolean) = true;
    (target.updated_at as string) = new Date().toISOString();
    return target;
  };

  export const isActive = (target: IProduct): boolean => {
    return !target.is_deleted;
  };

  export const isInActive = (target: IProduct): boolean => {
    return Predicate.negate(isActive)(target);
  };
}
