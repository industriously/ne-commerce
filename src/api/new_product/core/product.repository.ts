import { _add, _findMany, _findOne, _update } from '@COMMON/repository';
import { prisma } from '@INFRA/DB';
import { IProduct } from '@INTERFACE/product';
import { Prisma, Product } from '@PRISMA';
import { tryCatch } from '@UTIL';
import typia from 'typia';

export namespace ProductRepository {
  export const toProduct = (model: Product): IProduct => {
    const {
      id,
      name,
      price,
      description,
      vender_id,
      is_deleted,
      created_at,
      updated_at,
    } = model;
    return {
      id,
      name,
      price,
      description,
      vender_id,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
      is_deleted,
    };
  };

  export const findOne = _findOne(
    (id: string) =>
      ({
        id: typia.assert(id),
        is_deleted: false,
      } satisfies Prisma.ProductWhereInput),
    (where) => prisma.product.findFirstOrThrow({ where }),
    toProduct,
  );

  export const findMany = _findMany(
    (page: number) =>
      ({
        take: 30,
        skip: 30 * (page - 1),
        orderBy: { created_at: 'desc' },
      } satisfies Prisma.ProductFindManyArgs),
    (args) => prisma.product.findMany(args),
    toProduct,
  );

  export const count = tryCatch((): Promise<number> => prisma.product.count());

  export const add = _add(
    (input) => input satisfies Prisma.ProductUncheckedCreateInput,
    (data) => prisma.product.create({ data }),
    toProduct,
  );

  export const update = _update(
    (input: IProduct): Prisma.ProductWhereInput => ({
      id: input.id,
      is_deleted: false,
    }),
    (input): Prisma.ProductUpdateInput => ({
      name: input.name,
      price: input.price,
      description: input.description,
      is_deleted: input.is_deleted,
      updated_at: input.updated_at,
    }),
    (where, data) => prisma.product.updateMany({ where, data }),
  );
}