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
    async create(input) {
      const store = await client.get().store.findUnique({
        select: { id: true, is_deleted: true },
        where: { id: input.store_id },
      });
      if (store == null || store.is_deleted) {
        throw Error('store 없음');
      }
      const data = typia.assertPrune(input);
      const model = await product().create({ data });
      return ProductMapper.toDomain(model);
    },
    async update(product_id, input) {
      const id = typia.assert(product_id);
      const data = typia.assertPrune(input);
      await product().updateMany({ where: { id }, data });
      return;
    },
    async findOne(product_id) {
      const id = typia.assert(product_id);
      const model = await product().findUnique({
        where: { id },
      });
      return map(ProductMapper.toDomain)(model);
    },
    async save(aggregate) {
      const { id, name, description, price, is_deleted } =
        typia.assert(aggregate);
      await product().updateMany({
        where: { id },
        data: {
          name,
          price,
          description,
          is_deleted,
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
