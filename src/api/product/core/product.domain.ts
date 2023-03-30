import { IFailure, Mutable, Try, TryCatch } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { getTry, Failure } from '@COMMON/exception';
import { Predicate, getISOString } from '@UTIL';
import typia from 'typia';

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
  ): TryCatch<IProduct, IFailure.Internal.Invalid> => {
    if (!typia.is(input)) return Failure.Internal.InvalidValue;
    const { vender_id, name, description, price } = input;
    const now = new Date().toISOString();
    return getTry<IProduct>({
      id: randomId(10),
      name,
      description,
      price,
      vender_id,
      is_deleted: false,
      created_at: now,
      updated_at: now,
    });
  };

  export const update = (
    target: Mutable<IProduct>,
    input: IProduct.UpdateInput,
  ): TryCatch<IProduct, IFailure.Internal.Invalid> => {
    if (!typia.is(input)) return Failure.Internal.InvalidValue;
    target.name = input.name ?? target.name;
    target.description = input.description ?? target.description;
    target.price = input.price ?? target.price;
    target.updated_at = getISOString();
    return getTry<IProduct>(target);
  };

  export const activate = (target: Mutable<IProduct>): Try<IProduct> => {
    target.is_deleted = false;
    target.updated_at = getISOString();
    return getTry<IProduct>(target);
  };

  export const inActivate = (target: Mutable<IProduct>): Try<IProduct> => {
    target.is_deleted = true;
    target.updated_at = getISOString();
    return getTry<IProduct>(target);
  };

  export const isInActive = (target: IProduct): boolean => {
    return target.is_deleted;
  };

  export const isActive = Predicate.negate(isInActive);

  export const toSummary = (
    product: IProduct,
    vender: IProduct.Vender,
  ): Try<IProduct.Summary> => {
    const { id, name, price, description, created_at } = product;
    return getTry<IProduct.Summary>({
      id,
      name,
      price,
      vender,
      description,
      created_at,
    });
  };

  export const toDetail = (
    product: IProduct,
    vender: IProduct.Vender,
  ): Try<IProduct.Detail> => {
    const { id, name, price, description, is_deleted, created_at, updated_at } =
      product;
    return getTry<IProduct.Detail>({
      id,
      name,
      price,
      vender,
      description,
      is_deleted,
      created_at,
      updated_at,
    });
  };
}
