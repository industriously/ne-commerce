import { prisma } from '@INFRA/DB';
import { IUser } from '@INTERFACE/user';
import { User } from '@PRISMA';
import { randomUUID } from 'crypto';
import typia from 'typia';

interface SeedUserRandom
  extends Omit<
    User,
    'created_at' | 'updated_at' | 'id' | 'role' | 'is_deleted' | 'oauth_type'
  > {
  readonly oauth_type: IUser.OauthType;
}

export namespace SeedUser {
  export const vender_id = randomUUID();
  export const vender2_id = randomUUID();
  export const normal_id = randomUUID();
  export const inActive_id = randomUUID();
  export const seed = async () => {
    const result = await prisma.user.createMany({
      data: [
        {
          ...typia.random<SeedUserRandom>(),
          id: vender_id,
          role: 'vender',
          is_deleted: false,
        },
        {
          ...typia.random<SeedUserRandom>(),
          id: vender2_id,
          role: 'vender',
          is_deleted: false,
        },
        {
          ...typia.random<SeedUserRandom>(),
          id: normal_id,
          role: 'normal',
          is_deleted: false,
        },
        {
          ...typia.random<SeedUserRandom>(),
          id: inActive_id,
          role: 'normal',
          is_deleted: true,
        },
      ],
    });
    if (result.count < 4) {
      throw Error('fail to seed users');
    }
  };
}
