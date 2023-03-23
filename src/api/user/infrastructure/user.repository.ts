import { UserMapper } from '@USER/domain';
import { map, pipeAsync } from '@UTIL';
import { IUserRepository } from '@INTERFACE/user';
import typia from 'typia';
import { DBClient } from '@INTERFACE/common';
import { pipe } from 'rxjs';

export const UserRepositoryFactory = (client: DBClient): IUserRepository => {
  const user = () => client.get().user;
  return {
    async findManyByIds(ids) {
      const list = await user().findMany({ where: { id: { in: ids } } });
      return list.map(UserMapper.toAggregate);
    },
    create(data) {
      return pipeAsync(
        // validate input
        typia.createAssertPrune<IUserRepository.CreateData>(),
        // create user
        (data) => user().create({ data }),
        // transform to aggregate
        UserMapper.toAggregate,
      )(data);
    },

    findOne(product_id: string) {
      return pipeAsync(
        // validate input
        (id: string) => typia.assert(id),
        // find active user by id
        (id) =>
          user().findFirst({
            where: { id, is_deleted: false },
          }),
        // if user exist, transform to aggregate
        map(UserMapper.toAggregate),
      )(product_id);
    },

    findOneByOauth(filter) {
      return pipeAsync(
        // validate input
        typia.createAssert<IUserRepository.FindOneByOauthFilter>(),
        // find user by oauth data or email
        ({ sub, oauth_type, email }) =>
          user().findFirst({ where: { OR: [{ email }, { sub, oauth_type }] } }),
        // if user exist, transform to aggregate
        map(UserMapper.toAggregate),
      )(filter);
    },

    update(_data) {
      // validate update data
      const data = typia.assertPrune(_data);
      // curring function
      return pipe<string, string, Promise<void>>(
        // validate id
        typia.createAssert<string>(),
        // update active user, and return none
        async (id) => {
          await user().updateMany({
            where: { id, is_deleted: false },
            data: { ...data, updated_at: new Date() },
          });
        },
      );
    },

    async save(aggregate) {
      const { id, address, email, is_deleted, phone, username } = aggregate;
      await user().updateMany({
        where: { id },
        data: {
          address,
          email,
          is_deleted,
          phone,
          username,
          updated_at: new Date(),
        },
      });
      return aggregate;
    },

    remove(id) {
      return pipe(
        // validate input
        typia.createAssert<string>(),
        // inactivate user, and return none(void)
        async (id) => {
          await user().updateMany({
            where: { id },
            data: { is_deleted: false },
          });
        },
      )(id);
    },
  };
};
