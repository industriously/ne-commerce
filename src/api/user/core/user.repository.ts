import { IAuthentication } from '@INTERFACE/user';
import { IUser } from '@INTERFACE/user';
import { prisma } from '@INFRA/DB';
import { Prisma, User } from '@PRISMA';
import typia from 'typia';
import { getISOString, tryCatch } from '@UTIL';
import { _add, _findMany, _findOne, _update } from '@COMMON/repository';

export namespace UserRepository {
  const toUser = (user: User): IUser => {
    const props = {
      ...user,
      created_at: getISOString(user.created_at),
      updated_at: getISOString(user.updated_at),
    };
    return typia.assertEquals<IUser>(props);
  };

  export const add = _add(
    (input): Prisma.UserCreateInput => input satisfies Prisma.UserCreateInput,
    (data) => prisma.user.create({ data }),
    toUser,
  );

  export const findOne = _findOne(
    (id: string) =>
      ({
        id: typia.assert(id),
        is_deleted: false,
      } satisfies Prisma.UserWhereInput),
    (where) => prisma.user.findFirstOrThrow({ where }),
    toUser,
  );

  export const findOneByOauthProfile = tryCatch(
    async (profile: IAuthentication.OauthProfile): Promise<IUser> => {
      const { email, sub, oauth_type } = profile;
      const user = await prisma.user.findFirstOrThrow({
        where: { OR: [{ email }, { sub, oauth_type }] },
      });
      return toUser(user);
    },
  );

  export const findManyByIds = _findMany(
    (ids: string[]) =>
      ({
        where: { id: { in: ids }, is_deleted: false },
      } satisfies Prisma.UserFindManyArgs),
    (args) => prisma.user.findMany(args),
    toUser,
  );

  export const update = _update(
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
