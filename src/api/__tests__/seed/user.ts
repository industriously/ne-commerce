import { prisma } from '@INFRA/DB';
import { UserSchema } from '@INTERFACE/user';
import { User } from '@PRISMA';
import typia from 'typia';

interface SeedUserRandom
  extends Omit<
    User,
    'created_at' | 'updated_at' | 'id' | 'role' | 'is_deleted' | 'oauth_type'
  > {
  readonly oauth_type: UserSchema.OauthType;
}

export namespace SeedUser {
  export const vender_id = 'a09ab68a-eee9-44da-93ee-910d45dac16d';
  export const vender2_id = 'f70d55d8-efab-437a-82c0-a2ccbde7fc72';
  export const normal_id = 'bb72fb69-6e5d-4357-83c4-7e84da3b17ba';
  export const inActive_id = '8a11dd4b-f887-4d64-93fc-b5ffcc868d0a';
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

  export const getUser = (id: string): Promise<User> => {
    return prisma.user.findFirstOrThrow({ where: { id } });
  };
}
