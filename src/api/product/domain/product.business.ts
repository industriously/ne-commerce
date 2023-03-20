import { IProduct } from '@INTERFACE/product';
import { Predicate } from '@UTIL';

export namespace Product {
  export const update = (target: IProduct, input: IProduct.UpdateInput) => {
    (target.name as string) = input.name ?? target.name;
    (target.description as string) = input.description ?? target.description;
    (target.price as number) = input.price ?? target.price;
    return target;
  };

  export const activate = (target: IProduct) => {
    (target.is_deleted as boolean) = false;
    return target;
  };

  export const inActivate = (target: IProduct) => {
    (target.is_deleted as boolean) = true;
    return target;
  };

  export const isActive = (target: IProduct): boolean => {
    return !target.is_deleted;
  };

  export const isInActive = (target: IProduct): boolean => {
    return Predicate.negate(isActive)(target);
  };
}
