import { Try } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { users } from '@SDK/index';
import { NotFoundUser } from '@USER/core';
import { ArrayUtil } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { SeedUser } from '@test/seed';
import assert from 'assert';
import { randomUUID } from 'crypto';
import typia from 'typia';

const api = (connection: IConnection) => (id: string) =>
  users.findOne(connection, id);

console.log('  - --');

export const test_users_findOne_success = async (connection: IConnection) => {
  const received = await ArrayUtil.asyncMap(
    [SeedUser.customer_id, SeedUser.vender_id, SeedUser.vender2_id],
    api(connection),
  );

  typia.assertEquals<Try<IUser.ISummary>[]>(received);
};
export const test_users_findOne_not_found = async (connection: IConnection) => {
  // inActivated user
  const inActivated_user = await api(connection)(SeedUser.inActive_id);

  const received = await ArrayUtil.asyncRepeat(5, () =>
    api(connection)(randomUUID()),
  );

  assert.deepStrictEqual(inActivated_user, NotFoundUser);
  received.forEach((result) => assert.deepStrictEqual(result, NotFoundUser));
};
