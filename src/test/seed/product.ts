import { SeedUser } from './user';
import { prisma } from '@INFRA/DB';
import typia from 'typia';
import { Product } from '@PRODUCT/core';
import { IProduct } from '@INTERFACE/product';

interface CreateProduct
  extends Omit<IProduct, 'id' | 'is_deleted' | 'vender_id'> {}

export namespace SeedProduct {
  export const product1 = Product.randomId();
  export const product2 = Product.randomId();
  export const product3 = Product.randomId();
  export const inActive_product = Product.randomId();
  const vender_id = SeedUser.vender_id;
  const input = typia.createRandom<CreateProduct>();
  export const seed = async () => {
    const result = await prisma.product.createMany({
      data: [
        { ...input(), id: product1, vender_id, is_deleted: false },
        { ...input(), id: product2, vender_id, is_deleted: false },
        { ...input(), id: product3, vender_id, is_deleted: false },
        { ...input(), id: inActive_product, vender_id, is_deleted: true },
      ],
    });

    if (result.count < 4) {
      throw Error('fail to seed products');
    }
  };
}
