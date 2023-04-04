import { Failure, getTry } from '@COMMON/exception';
import { _findMany, _findOne, _update } from '@COMMON/repository';
import { prisma } from '@INFRA/DB';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { Product } from '@PRISMA';
import { getISOString } from '@UTIL';
import typia from 'typia';
import { NotFoundProduct } from './exception';

export namespace ProductRepository {
  export const toProduct = (
    model: Product,
  ): TryCatch<IProduct, IFailure.Internal.Invalid> => {
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
    const product = {
      id,
      name,
      price,
      description,
      vender_id,
      created_at: getISOString(created_at),
      updated_at: getISOString(updated_at),
      is_deleted,
    };
    return typia.is<IProduct>(product)
      ? getTry(product)
      : Failure.Internal.InvalidValue;
  };

  export const findOne: (
    product_id: string,
  ) => Promise<
    TryCatch<IProduct, IFailure.Internal.Invalid | IFailure.Business.NotFound>
  > = _findOne(
    (id) => prisma.product.findFirst({ where: { id, is_deleted: false } }),
    toProduct,
    NotFoundProduct,
  );

  export const findMany: (page: number) => Promise<Try<IProduct[]>> = _findMany(
    (page) =>
      prisma.product.findMany({
        take: 30,
        skip: 30 * (page - 1),
        orderBy: { created_at: 'desc' },
      }),
    toProduct,
  );

  export const findManyByIds: (ids: string[]) => Promise<Try<IProduct[]>> =
    _findMany(
      (ids) =>
        prisma.product.findMany({
          where: { id: { in: ids }, is_deleted: false },
        }),
      toProduct,
    );

  export const count = async (): Promise<Try<number>> =>
    getTry(await prisma.product.count());

  export const add = async (
    input: IProduct,
  ): Promise<TryCatch<IProduct, IFailure.Internal.Invalid>> => {
    const model = await prisma.product.create({ data: input });
    return toProduct(model);
  };

  export const update: (
    input: IProduct,
  ) => Promise<TryCatch<IProduct, IFailure.Business.NotFound>> = _update(
    (product) =>
      prisma.product.updateMany({
        where: { id: product.id, is_deleted: false },
        data: {
          name: product.name,
          price: product.price,
          description: product.description,
          is_deleted: product.is_deleted,
          updated_at: product.updated_at,
        },
      }),
    NotFoundProduct,
  );
}
