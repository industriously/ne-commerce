import { IProduct } from '@INTERFACE/product';
import { Predicate } from '@UTIL';
import typia from 'typia';
import { Mutable } from '@INTERFACE/common';

export namespace Product {
  const ABC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const integer = (end: number) => {
    const temp = Math.floor(Math.random() * end);
    return temp === end ? temp - 1 : temp;
  };
  export const randomId = (len: number) => {
    return new Array<number>(len)
      .fill(ABC.length)
      .map((end) => ABC[integer(end)])
      .join('');
  };
  export const create = (
    input: IProduct.CreateInput & Pick<IProduct, 'vender_id'>,
  ): IProduct => {
    const { vender_id, name, description, price } = typia.assert(input);
    const now = new Date().toISOString();
    return {
      id: randomId(10),
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
