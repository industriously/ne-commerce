import { IAuthentication } from '@INTERFACE/user';
import { IUser } from '@INTERFACE/user';
import { prisma } from '@INFRA/DB';
import { User } from '@PRISMA';
import typia from 'typia';
import { getISOString, isStringArray } from '@UTIL';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { _findMany, _findOne, _update } from '@COMMON/repository';
import { Failure, getTry } from '@COMMON/exception';
import { NotFoundUser } from './exception';

export namespace UserRepository {
  const toUser = (user: User): TryCatch<IUser, IFailure.Internal.Invalid> => {
    const props = {
      ...user,
      created_at: getISOString(user.created_at),
      updated_at: getISOString(user.updated_at),
    };
    if (!typia.equals<IUser>(props)) {
      return Failure.Internal.InvalidValue;
    }
    return getTry(props);
  };

  export const add = async (
    input: IUser,
  ): Promise<
    TryCatch<IUser, IFailure.Internal.Fail | IFailure.Internal.Invalid>
  > => {
    try {
      const model = await prisma.user.create({ data: input });
      return toUser(model);
    } catch (error) {
      return Failure.Internal.FailDB;
    }
  };

  export const findOne = _findOne(
    (id: string): id is string => typeof id === 'string',
    (id: string) => prisma.user.findFirst({ where: { id, is_deleted: false } }),
    toUser,
    NotFoundUser,
  );

  export const findOneByOauthProfile = _findOne(
    typia.createIs<IAuthentication.OauthProfile>(),
    ({ email, sub, oauth_type }) =>
      prisma.user.findFirst({
        where: { OR: [{ email }, { sub, oauth_type }] },
      }),
    toUser,
    NotFoundUser,
  );

  export const findManyByIds = _findMany(
    isStringArray,
    (ids: string[]) =>
      prisma.user.findMany({ where: { id: { in: ids }, is_deleted: false } }),
    toUser,
  );

  export const update = _update(
    (user: IUser) =>
      prisma.user.updateMany({
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
      }),
    NotFoundUser,
  );
}
