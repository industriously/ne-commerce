import { Exception, getSuccessReturn } from '@COMMON/exception';
import { PaginatedResponse, Try, TryCatch } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { VenderService } from '@USER/service';
import { flatten, ifSuccess, pipeAsync, isUndefined, is_success } from '@UTIL';
import { Product } from '../core';
import { ProductRepository } from '../core';
import { ProductService } from '../service';

export namespace ProductUsecase {
  export const findOne = pipeAsync(
    ProductRepository.findOne,

    ifSuccess(async (product: IProduct) => {
      const vender = await VenderService.findVender(product.vender_id);
      return ifSuccess((user: IProduct.Vender) =>
        Product.toDetail(product, user),
      )(vender);
    }),

    (result) => (result.code === '4006' ? Exception.PRODUCT_NOT_FOUND : result),
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
        return isUndefined(vender)
          ? Exception.PRODUCT_NOT_FOUND
          : Product.toSummary(product, vender);
      })
      .filter(is_success)
      .map(flatten);

    return getSuccessReturn<PaginatedResponse<IProduct.Summary>>({
      data,
      page: 1,
      total_count,
    });
  };

  export const create = async (
    token: string,
    input: IProduct.CreateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | typeof Exception.INVALID_TOKEN
      | typeof Exception.FORBIDDEN_VENDER
      | typeof Exception.PRODUCT_CREATE_FAIL
    >
  > => {
    const vender = await VenderService.getVenderByToken(token);
    if (vender.code !== '1000') return vender;
    return pipeAsync(
      (data: IProduct.Vender) =>
        Product.create({ ...input, vender_id: data.id }),

      ifSuccess(ProductRepository.add),

      ifSuccess((product: IProduct) => Product.toDetail(product, vender.data)),

      (result) =>
        result.code === '4000' ? Exception.PRODUCT_CREATE_FAIL : result,
    )(vender.data);
  };

  export const update = async (
    token: string,
    product_id: string,
    input: IProduct.UpdateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | typeof Exception.INVALID_TOKEN
      | typeof Exception.PRODUCT_NOT_FOUND
      | typeof Exception.FORBIDDEN_PRODUCT_UPDATE
      | typeof Exception.PRODUCT_UPDATE_FAIL
    >
  > => {
    const result = await ProductRepository.findOne(product_id);
    if (result.code === '4009') return result;
    const product = flatten(result);
    const vender = await ProductService.getAuthorizedVender(token, product);

    if (vender.code !== '1000') return vender;

    return pipeAsync(
      (data: IProduct.UpdateInput) => Product.update(product, data),

      ifSuccess(ProductRepository.update),

      ifSuccess((product: IProduct) => Product.toDetail(product, vender.data)),

      (result) =>
        result.code === '4000' ? Exception.PRODUCT_UPDATE_FAIL : result,
    )(input);
  };

  export const inActivate = async (
    token: string,
    product_id: string,
  ): Promise<
    TryCatch<
      true,
      | typeof Exception.INVALID_TOKEN
      | typeof Exception.FORBIDDEN_PRODUCT_UPDATE
      | typeof Exception.PRODUCT_NOT_FOUND
      | typeof Exception.PRODUCT_UPDATE_FAIL
    >
  > => {
    const result = await ProductRepository.findOne(product_id);
    if (result.code === '4009') return result;
    const authorized = await ProductService.getAuthorizedVender(
      token,
      result.data,
    );
    if (authorized.code !== '1000') return authorized;
    return pipeAsync(
      Product.inActivate,

      flatten,

      ProductRepository.update,

      (result) =>
        result.code === '4009' ? Exception.PRODUCT_UPDATE_FAIL : result,

      ifSuccess(() => getSuccessReturn(true as const)),
    )(result.data);
  };
}
