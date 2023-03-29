import { IAuthentication } from '@INTERFACE/user';
import { IUser } from '@INTERFACE/user';
import { prisma } from '@INFRA/DB';
import { User } from '@PRISMA';
import typia from 'typia';
import { getISOString, isNull, is_success, List, pipeAsync } from '@UTIL';
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
  ): Promise<
    TryCatch<
      IUser,
      typeof Exception.INVALID_VALUE | typeof Exception.USER_NOT_FOUND
    >
  > => {
    if (typeof id !== 'string') {
      return Exception.INVALID_VALUE;
    }
    const model = await prisma.user.findFirst({
      where: { id, is_deleted: false },
    });
    if (isNull(model)) {
      return Exception.USER_NOT_FOUND;
    }
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

  export const findManyByIds = pipeAsync(
    (ids: string[]) =>
      prisma.user.findMany({ where: { id: { in: ids }, is_deleted: false } }),

    List.map(toUser),

    (result) => result.filter(is_success),

    List.map((result) => result.data),
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
}
