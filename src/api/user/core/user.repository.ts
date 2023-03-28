import { IAuthentication } from '@INTERFACE/user';
import { IUser } from '@INTERFACE/user';
import { prisma } from '@INFRA/DB';
import { Prisma, User } from '@PRISMA';
import typia from 'typia';
import { getISOString, isNull } from '@UTIL';
import { _add, _findMany, _findOne, _update } from '@COMMON/repository';
import { TryCatch } from '@INTERFACE/common';
import { Exception, getSuccessReturn } from '@COMMON/exception';

export namespace UserRepository {
  const toUser = (
    user: User,
  ): TryCatch<IUser, typeof Exception.INVALID_VALUE> => {
    const props = {
      ...user,
      created_at: getISOString(user.created_at),
      updated_at: getISOString(user.updated_at),
    };
    if (!typia.equals<IUser>(props)) {
      return Exception.INVALID_VALUE;
    }
    return getSuccessReturn(props);
  };

  export const add = async (
    input: IUser,
  ): Promise<TryCatch<IUser, typeof Exception.INVALID_VALUE>> => {
    const model = await prisma.user.create({ data: input });
    return toUser(model);
  };

  export const findOne = async (
    id: string,
  ): Promise<TryCatch<IUser, typeof Exception.INVALID_VALUE>> => {
    if (typeof id !== 'string') {
      return Exception.INVALID_VALUE;
    }
    const model = await prisma.user.findFirstOrThrow({
      where: { id, is_deleted: false },
    });
    return toUser(model);
  };

  export const findOneByOauthProfile = async (
    profile: IAuthentication.OauthProfile,
  ): Promise<
    TryCatch<
      IUser,
      typeof Exception.INVALID_VALUE | typeof Exception.USER_NOT_FOUND
    >
  > => {
    const { email, sub, oauth_type } = profile;
    const user = await prisma.user.findFirst({
      where: { OR: [{ email }, { sub, oauth_type }] },
    });
    if (isNull(user)) {
      return Exception.USER_NOT_FOUND;
    }
    return toUser(user);
  };

  export const findManyByIds = _findMany(
    (ids: string[]) =>
      ({
        where: { id: { in: ids }, is_deleted: false },
      } satisfies Prisma.UserFindManyArgs),
    (args) => prisma.user.findMany(args),
    toUser,
  );

  export const update = async (
    user: IUser,
  ): Promise<TryCatch<IUser, typeof Exception.USER_NOT_FOUND>> => {
    const { count } = await prisma.user.updateMany({
      where: { id: user.id, is_deleted: false },
      data: {
        email: user.email,
        name: user.name,
        address: user.address,
        phone: user.phone,
        is_deleted: user.is_deleted,
        updated_at: user.updated_at,
        role: user.role,
      },
    });
    if (count < 1) {
      return Exception.USER_NOT_FOUND;
    }
    return getSuccessReturn(user);
  };

  _update(
    (user: IUser) =>
      ({ id: user.id, is_deleted: false } satisfies Prisma.UserWhereInput),
    (user: IUser) =>
      ({
        email: user.email,
        name: user.name,
        address: user.address,
        phone: user.phone,
        is_deleted: user.is_deleted,
        updated_at: user.updated_at,
        role: user.role,
      } satisfies Prisma.UserWhereInput),
    (where, data) => prisma.user.updateMany({ where, data }),
  );
}
