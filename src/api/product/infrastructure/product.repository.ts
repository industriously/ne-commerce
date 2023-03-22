import { DBClient } from '@INTERFACE/common';
import { IProductRepository } from '@INTERFACE/product';
import { ProductMapper } from '@PRODUCT/domain';
import { map, ProviderBuilder } from '@UTIL';
import typia from 'typia';

export const ProductRepositoryFactory = (
  client: DBClient,
): IProductRepository => {
  const product = () => client.get().product;
  return ProviderBuilder<IProductRepository>({
    async findMany(page) {
      const take = 30;
      const [list, cnt] = await Promise.all([
        product().findMany({
          take,
          skip: (page - 1) * take,
        }),
        product().count(),
      ]);
      return [list.map(ProductMapper.toDomain), cnt];
    },
    async findOne(product_id) {
      const id = typia.assert(product_id);
      const model = await product().findUnique({
        where: { id },
      });
      return map(ProductMapper.toDomain)(model);
    },
    async save(aggregate) {
      const {
        id,
        name,
        description,
        price,
        store_id,
        is_deleted,
        created_at,
        updated_at,
      } = aggregate;
      product().upsert({
        where: { id },
        create: {
          id,
          name,
          description,
          price,
          store_id,
          is_deleted,
          created_at,
          updated_at,
        },
        update: {
          name,
          description,
          price,
          is_deleted,
          updated_at,
        },
      });
      return aggregate;
    },
    async remove(product_id) {
      const id = typia.assert(product_id);
      await product().deleteMany({ where: { id } });
      return;
    },
  }).build();
};