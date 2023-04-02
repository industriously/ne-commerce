import { ICustomer, IVender } from '@INTERFACE/user';
import { IUser } from '@INTERFACE/user';
import { prisma } from '@INFRA/DB';
import { User } from '@PRISMA';
import typia from 'typia';
import { getISOString } from '@UTIL';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { _findMany, _findOne, _update } from '@COMMON/repository';
import { Failure, getTry } from '@COMMON/exception';
import { NotFoundUser } from './exception';

export namespace UserRepository {
  const toCustomer = (
    model: User,
  ): TryCatch<ICustomer, IFailure.Internal.Invalid> => {
    const user = {
      id: model.id,
      sub: model.sub,
      oauth_type: model.oauth_type as IUser.OauthType,
      email: model.email,
      name: model.name,
      type: model.type as 'customer',
      address: model.address,
      phone: model.phone,
      is_deleted: model.is_deleted,
      created_at: getISOString(model.created_at),
      updated_at: getISOString(model.updated_at),
    } satisfies ICustomer;

    return typia.equals<ICustomer>(user)
      ? getTry(user)
      : Failure.Internal.InvalidValue;
  };
  const toVender = (
    model: User,
  ): TryCatch<IVender, IFailure.Internal.Invalid> => {
    const user = {
      id: model.id,
      sub: model.sub,
      oauth_type: model.oauth_type as IUser.OauthType,
      email: model.email,
      name: model.name,
      type: model.type as 'vender',
      address: model.address as string,
      phone: model.phone as string,
      is_deleted: model.is_deleted,
      created_at: getISOString(model.created_at),
      updated_at: getISOString(model.updated_at),
    } satisfies IVender;

    return typia.equals<IVender>(user)
      ? getTry(user)
      : Failure.Internal.InvalidValue;
  };

  const toUser = (model: User): TryCatch<IUser, IFailure.Internal.Invalid> =>
    model.type === 'customer' ? toCustomer(model) : toVender(model);

  export const add = async (
    input: IUser,
  ): Promise<TryCatch<IUser, IFailure.Internal.Invalid>> => {
    const model = await prisma.user.create({ data: input });
    return toUser(model);
  };

  export const findOne = _findOne(
    (id: string) => prisma.user.findFirst({ where: { id, is_deleted: false } }),
    toUser,
    NotFoundUser,
  );

  export const findOneByAuthentication: (
    profile: IUser.IAuthentication,
  ) => Promise<
    TryCatch<IUser, IFailure.Business.NotFound | IFailure.Internal.Invalid>
  > = _findOne(
    ({ email, sub, oauth_type }) =>
      prisma.user.findFirst({
        where: { OR: [{ email }, { sub, oauth_type }] },
      }),
    toUser,
    NotFoundUser,
  );

  export const findManyByIds: (input: string[]) => Promise<Try<IUser[]>> =
    _findMany(
      async (ids) =>
        ids.length > 0
          ? prisma.user.findMany({
              where: { id: { in: ids }, is_deleted: false },
            })
          : [],
      toUser,
    );

  export const update: <U extends IUser>(
    user: U,
  ) => Promise<TryCatch<U, IFailure.Business.NotFound>> = _update(
    (user) =>
      prisma.user.updateMany({
        where: { id: user.id, is_deleted: false },
        data: {
          type: user.type,
          email: user.email,
          name: user.name,
          address: user.address,
          phone: user.phone,
          is_deleted: user.is_deleted,
          updated_at: user.updated_at,
        },
      }),
    NotFoundUser,
  );
}
