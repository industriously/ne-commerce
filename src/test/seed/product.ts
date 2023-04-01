import { SeedUser } from './user';
import { prisma } from '@INFRA/DB';
import { Product as ProductModel } from '@PRISMA';
import typia from 'typia';
import { Product } from '@PRODUCT/core';

interface SeedProductRandom
  extends Omit<
    ProductModel,
    'created_at' | 'updated_at' | 'vender_id' | 'is_deleted' | 'id' | 'price'
  > {
  readonly is_deleted: false;
  /**
   * @type uint
   * @minimum 0
   */
  readonly price: number;
}

export namespace SeedProduct {
  export const product1 = Product.randomId();
  export const product2 = Product.randomId();
  export const product3 = Product.randomId();
  export const inActive_product = Product.randomId();
  export const seed = async () => {
    const result = await prisma.product.createMany({
      data: [
        {
          ...typia.random<SeedProductRandom>(),
          id: product1,
          vender_id: SeedUser.vender_id,
        },
        {
          ...typia.random<SeedProductRandom>(),
          id: product2,
          vender_id: SeedUser.vender_id,
        },
        {
          ...typia.random<SeedProductRandom>(),
          id: product3,
          vender_id: SeedUser.vender_id,
        },
        {
          ...typia.random<SeedProductRandom>(),
          id: inActive_product,
          vender_id: SeedUser.vender_id,
          is_deleted: true,
        },
      ],
    });
    if (result.count < 4) {
      throw Error('fail to seed products');
    }
  };
}
