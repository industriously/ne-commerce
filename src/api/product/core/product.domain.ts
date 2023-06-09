import { Mutable } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { Predicate, getISOString } from '@UTIL';

export namespace Product {
  const ABC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const integer = (end: number) => {
    const temp = Math.floor(Math.random() * end);
    return temp === end ? temp - 1 : temp;
  };
  export const randomId = (len: number = 10) => {
    return new Array<number>(len)
      .fill(ABC.length)
      .map((end) => ABC[integer(end)])
      .join('');
  };

  export const create = (
    input: IProduct.CreateInput & Pick<IProduct, 'vender_id'>,
  ): IProduct => {
    const { vender_id, name, description, price } = input;
    const now = getISOString();
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
  ): IProduct => {
    target.name = input.name ?? target.name;
    target.description = input.description ?? target.description;
    target.price = input.price ?? target.price;
    target.updated_at = getISOString();
    return target;
  };

  export const activate = (target: Mutable<IProduct>): IProduct => {
    target.is_deleted = false;
    target.updated_at = getISOString();
    return target;
  };

  export const inActivate = (target: Mutable<IProduct>): IProduct => {
    target.is_deleted = true;
    target.updated_at = getISOString();
    return target;
  };

  export const isInActive = (target: IProduct): boolean => {
    return target.is_deleted;
  };

  export const isActive = Predicate.negate(isInActive);

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
