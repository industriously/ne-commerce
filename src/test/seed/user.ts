import { prisma } from '@INFRA/DB';
import { ICustomer, IVender } from '@INTERFACE/user';
import { randomUUID } from 'crypto';
import typia from 'typia';

interface CreateVender extends Omit<IVender, 'is_deleted' | 'id'> {}

interface CreateCustomer extends Omit<ICustomer, 'is_deleted' | 'id'> {}

export namespace SeedUser {
  export const vender_id = randomUUID();
  export const vender2_id = randomUUID();
  export const customer_id = randomUUID();
  export const inActive_id = randomUUID();

  const inputV = typia.createRandom<CreateVender>();
  const inputC = typia.createRandom<CreateCustomer>();
  export const seed = async () => {
    const result = await prisma.user.createMany({
      data: [
        { ...inputV(), id: vender_id, is_deleted: false },
        { ...inputV(), id: vender2_id, is_deleted: false },
        { ...inputC(), id: customer_id, is_deleted: false },
        { ...inputC(), id: inActive_id, is_deleted: true },
      ],
    });
    if (result.count < 4) {
      throw Error('fail to seed users');
    }
  };
}
