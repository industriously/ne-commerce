import { getISOString, isUndefined, Predicate } from '@UTIL';
import { IUser } from '@INTERFACE/user';
import { randomUUID } from 'crypto';
import typia from 'typia';
import { Mutable, Try, TryCatch } from '@INTERFACE/common';
import { Exception, getSuccessReturn } from '@COMMON/exception';

export namespace User {
  export const create = (
    input: IUser.CreateInput,
  ): TryCatch<IUser, typeof Exception.INVALID_VALUE> => {
    if (!typia.is(input)) return Exception.INVALID_VALUE;
    const { name, email, oauth_type, sub } = input;
    const date = getISOString();
    return getSuccessReturn<IUser>({
      id: randomUUID(),
      sub,
      oauth_type,
      email,
      name,
      role: 'normal',
      address: null,
      phone: null,
      is_deleted: false,
      created_at: date,
      updated_at: date,
    });
  };

  export const update = (
    user: Mutable<IUser>,
    input: IUser.UpdateInput,
  ): TryCatch<IUser, typeof Exception.INVALID_VALUE> => {
    if (!typia.is(input)) return Exception.INVALID_VALUE;
    const { name, address, phone } = input;
    user.name = !isUndefined(name) ? name : user.name;
    user.address = !isUndefined(address) ? address : user.address;
    user.phone = !isUndefined(phone) ? phone : user.phone;
    return getSuccessReturn<IUser>(user);
  };

  export const isInActive = (user: IUser): boolean => {
    return user.is_deleted;
  };

  export const isActive = Predicate.negate(isInActive);

  export const activate = (user: Mutable<IUser>): Try<IUser> => {
    user.is_deleted = false;
    user.updated_at = getISOString();
    return getSuccessReturn<IUser>(user);
  };

  export const inActivate = (user: Mutable<IUser>): Try<IUser> => {
    user.is_deleted = true;
    user.updated_at = getISOString();
    return getSuccessReturn<IUser>(user);
  };

  export const toDetail = (user: IUser): Try<IUser.Detail> => {
    return getSuccessReturn<IUser.Detail>(user);
  };
  export const toPublic = (user: IUser): Try<IUser.Public> => {
    const { id, name, email } = user;
    return getSuccessReturn<IUser.Public>({ id, name, email });
  };
}
