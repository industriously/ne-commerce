import { getTry, HttpExceptionFactory } from '@COMMON/exception';
import { PaginatedResponse, Try, TryCatch, IFailure } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { VenderService } from '@USER/service';
import {
  flatten,
  ifSuccess,
  pipeAsync,
  isUndefined,
  throwError,
  isInternalInvalid,
  isBusinessNotFound,
  isBusiness,
  isBusinessInvalid,
  isBusinessForbidden,
} from '@UTIL';
import { Product } from '../core';
import { ProductRepository } from '../core';
import { ProductService } from '../service';

export namespace ProductUsecase {
  export const findOne: (
    id: string,
  ) => Promise<TryCatch<IProduct.Detail, IFailure.Business.NotFound>> =
    pipeAsync(
      ProductRepository.findOne,

      ifSuccess(async (product: IProduct) => {
        const result = await VenderService.findVender(product.vender_id);
        if (isBusinessNotFound(result))
          throw HttpExceptionFactory('Unprocessable Entity');
        return getTry(Product.toDetail(product, flatten(result)));
      }),

      (result) =>
        isInternalInvalid(result)
          ? throwError(HttpExceptionFactory('Unprocessable Entity'))
          : result,
    );

  export const findMany = async (
    page: number,
  ): Promise<Try<PaginatedResponse<IProduct.Summary>>> => {
    const [{ data: product_list }, { data: total_count }] = await Promise.all([
      ProductRepository.findMany(page),
      ProductRepository.count(),
    ]);

    const vender_list = flatten(
      await VenderService.findVendersByIds(
        product_list.map((product) => product.id),
      ),
    );
    const data = product_list
      .map((product) => {
        const vender = vender_list.find((v) => v.id === product.vender_id);
        return isUndefined(vender) ? null : Product.toSummary(product, vender);
      })
      .filter((item): item is IProduct.Summary => item !== null);

    return getTry<PaginatedResponse<IProduct.Summary>>({
      data,
      page,
      total_count,
    });
  };

  export const create = async (
    token: string,
    input: IProduct.CreateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      IFailure.Business.Invalid | IFailure.Business.Forbidden
    >
  > => {
    const vender = await VenderService.getVenderByToken(token);
    if (isBusiness(vender)) return vender;

    return pipeAsync(
      flatten<IProduct.Vender>,

      (data) =>
        ProductRepository.add(Product.create({ ...input, vender_id: data.id })),

      ifSuccess((product: IProduct) =>
        getTry(Product.toDetail(product, flatten(vender))),
      ),

      (result) =>
        isInternalInvalid(result)
          ? throwError(HttpExceptionFactory('Unprocessable Entity'))
          : result,
    )(vender);
  };

  export const update = async (
    token: string,
    product_id: string,
    input: IProduct.UpdateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | IFailure.Business.NotFound
      | IFailure.Business.Forbidden
      | IFailure.Business.Invalid
    >
  > => {
    const result = await ProductRepository.findOne(product_id);

    if (isBusinessNotFound(result)) return result;
    if (isInternalInvalid(result))
      throw HttpExceptionFactory('Unprocessable Entity');

    const product = flatten(result);
    const vender = await ProductService.getAuthorizedVender(token, product);

    if (isBusinessInvalid(vender) || isBusinessForbidden(vender)) return vender;

    return pipeAsync(
      (data: IProduct.UpdateInput) =>
        ProductRepository.update(Product.update(product, data)),

      ifSuccess((product: IProduct) =>
        getTry(Product.toDetail(product, flatten(vender))),
      ),

      (result) =>
        isBusinessNotFound(result)
          ? throwError(HttpExceptionFactory('ISE'))
          : result,
    )(input);
  };

  export const inActivate = async (
    token: string,
    product_id: string,
  ): Promise<
    TryCatch<
      true,
      | IFailure.Business.NotFound
      | IFailure.Business.Forbidden
      | IFailure.Business.Invalid
    >
  > => {
    const result = await ProductRepository.findOne(product_id);

    if (isBusinessNotFound(result)) return result;
    if (isInternalInvalid(result))
      throw HttpExceptionFactory('Unprocessable Entity');

    const authorized = await ProductService.getAuthorizedVender(
      token,
      result.data,
    );
    if (isBusiness(authorized)) return authorized;

    const product = await ProductRepository.update(
      Product.inActivate(flatten(result)),
    );

    if (isBusinessNotFound(product)) throw HttpExceptionFactory('ISE');

    return getTry(true);
  };
}
