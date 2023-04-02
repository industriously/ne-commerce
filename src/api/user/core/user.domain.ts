import { getISOString, isUndefined, Predicate } from '@UTIL';
import { ICustomer, IUser, IVender } from '@INTERFACE/user';
import { randomUUID } from 'crypto';
import { Mutable } from '@INTERFACE/common';

export namespace User {
  export const createCustomer = (input: IUser.ICreate): ICustomer => {
    const { name, email, oauth_type, sub } = input;
    const date = getISOString();
    return {
      id: randomUUID(),
      sub,
      oauth_type,
      email,
      name,
      type: 'customer',
      address: null,
      phone: null,
      is_deleted: false,
      created_at: date,
      updated_at: date,
    };
  };

  export const update = (user: Mutable<IUser>, input: IUser.IUpdate): IUser => {
    const { name, address, phone } = input;
    user.name = !isUndefined(name) ? name : user.name;
    if (User.isVender(user)) {
      (user as Mutable<IVender>).address = address ? address : user.address;
      (user as Mutable<IVender>).phone = phone ? phone : user.phone;
    } else {
      user.address = !isUndefined(address) ? address : user.address;
      user.phone = !isUndefined(phone) ? phone : user.phone;
    }
    return user;
  };

  export const isInActive = (user: IUser): boolean => {
    return user.is_deleted;
  };

  export const isActive = Predicate.negate(isInActive);

  export const activate = (user: Mutable<IUser>): IUser => {
    user.is_deleted = false;
    user.updated_at = getISOString();
    return user;
  };

  export const inActivate = (user: Mutable<IUser>): IUser => {
    user.is_deleted = true;
    user.updated_at = getISOString();
    return user;
  };

  export const toSummary = (user: IUser): IUser.ISummary => {
    const { id, name, type } = user;
    return { id, name, type };
  };

  export const isCustomer = (user: IUser): user is ICustomer =>
    user.type === 'customer';

  export const isVender = (user: IUser): user is IVender =>
    user.type === 'vender';
}
