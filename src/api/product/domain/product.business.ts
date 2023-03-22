import { randomUUID } from 'crypto';
import { IProduct } from '@INTERFACE/product';
import { Predicate } from '@UTIL';
import typia from 'typia';
import { Mutable } from '@INTERFACE/common';

export namespace Product {
  export const create = (input: IProduct.CreateInput): IProduct => {
    const { code, vender_id, name, description, price } = typia.assert(input);
    const now = new Date().toISOString();
    return {
      id: randomUUID(),
      code,
      name,
      description,
      price,
      vender_id,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    };
  };

  export const update = (
    target: Mutable<IProduct>,
    input: IProduct.UpdateInput,
  ) => {
    target.name = input.name ?? target.name;
    target.description = input.description ?? target.description;
    target.price = input.price ?? target.price;
    target.updated_at = new Date().toISOString();
    return target;
  };

  export const activate = (target: Mutable<IProduct>) => {
    target.is_deleted = false;
    target.updated_at = new Date().toISOString();
    return target;
  };

  export const inActivate = (target: Mutable<IProduct>) => {
    target.is_deleted = true;
    target.updated_at = new Date().toISOString();
    return target;
  };

  export const isActive = (target: IProduct): boolean => {
    return !target.is_deleted;
  };

  export const isInActive = (target: IProduct): boolean => {
    return Predicate.negate(isActive)(target);
  };
}
