import { IAuthentication } from '@INTERFACE/user';
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
  const toUser = (user: User): TryCatch<IUser, IFailure.Internal.Invalid> => {
    const props = {
      ...user,
      created_at: getISOString(user.created_at),
      updated_at: getISOString(user.updated_at),
    };

    return typia.equals<IUser>(props)
      ? getTry(props)
      : Failure.Internal.InvalidValue;
  };

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

  export const findOneByOauthProfile: (
    profile: IAuthentication.OauthProfile,
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
      (ids) =>
        prisma.user.findMany({ where: { id: { in: ids }, is_deleted: false } }),
      toUser,
    );

  export const update: (
    user: IUser,
  ) => Promise<TryCatch<IUser, IFailure.Business.NotFound>> = _update(
    (user) =>
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
