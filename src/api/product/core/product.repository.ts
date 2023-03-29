import { Exception, getSuccessReturn } from '@COMMON/exception';
import { _findMany, _findOne, _update } from '@COMMON/repository';
import { prisma } from '@INFRA/DB';
import { Try, TryCatch } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { Product } from '@PRISMA';
import { getISOString, isNumber, isString } from '@UTIL';
import typia from 'typia';

export namespace ProductRepository {
  export const toProduct = (
    model: Product,
  ): TryCatch<IProduct, typeof Exception.INVALID_VALUE> => {
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
    if (!typia.is<IProduct>(product)) return Exception.INVALID_VALUE;
    return getSuccessReturn(product);
  };

  export const findOne = _findOne(
    isString,
    (id: string) =>
      prisma.product.findFirst({ where: { id, is_deleted: false } }),
    toProduct,
    Exception.PRODUCT_NOT_FOUND,
  );

  export const findMany = _findMany(
    isNumber,
    (page) =>
      prisma.product.findMany({
        take: 30,
        skip: 30 * (page - 1),
        orderBy: { created_at: 'desc' },
      }),
    toProduct,
  );

  export const count = async (): Promise<Try<number>> =>
    getSuccessReturn(await prisma.product.count());

  export const add = async (
    input: IProduct,
  ): Promise<TryCatch<IProduct, typeof Exception.INVALID_VALUE>> => {
    const model = await prisma.product.create({ data: input });
    return toProduct(model);
  };

  export const update = _update(
    (product: IProduct) =>
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
    Exception.PRODUCT_NOT_FOUND,
  );
}
