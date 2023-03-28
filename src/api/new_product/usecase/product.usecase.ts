import { HttpExceptionFactory } from '@COMMON/exception';
import { _findOne } from '@COMMON/service';
import { TryCatch } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { VenderService } from '@USER/service';
import { Product } from '../core';
import { ProductRepository } from '../core';
import { ProductService } from '../service';

export namespace ProductUsecase {
  export const findOne = async (
    product_id: string,
  ): Promise<IProduct.Detail> => {
    const product = await _findOne(ProductRepository.findOne)(product_id);
    const vender = await VenderService.findVender(product.vender_id);
    return Product.toDetail(product, vender);
  };
  export const findMany = async (
    page: number,
  ): Promise<IProduct.Response.SummaryList> => {
    const [findMany, count] = await Promise.all([
      ProductRepository.findMany(page),
      ProductRepository.count(),
    ]);
    if (!findMany.is_success || !count.is_success) {
      throw HttpExceptionFactory('ISE');
    }
    const vender_list = await VenderService.findVendersByIds(
      findMany.result.map((product) => product.id),
    );
    const total_count = count.result;
    const data = findMany.result.map((product) => {
      const vender = vender_list.find((v) => v.id === product.vender_id);
      return Product.toSummary(
        product,
        vender ?? { id: product.vender_id, name: '' },
      );
    });
    return { data, page: 1, total_count };
  };

  const _execute = async <T>(
    product: IProduct,
    command: (input: IProduct) => Promise<TryCatch<IProduct>>,
    mapper: (product: IProduct) => T,
  ): Promise<T> => {
    const { is_success, result } = await command(product);
    if (!is_success) {
      throw HttpExceptionFactory('ISE');
    }
    return mapper(result);
  };

  const _toDetail = (vender: IProduct.Vender) => (product: IProduct) => {
    return Product.toDetail(product, vender);
  };

  export const create = async (
    token: string,
    input: IProduct.CreateInput,
  ): Promise<IProduct.Detail> => {
    const vender = await VenderService.getVenderByToken(token);
    const product = Product.create({ ...input, vender_id: vender.id });
    return _execute(product, ProductRepository.add, _toDetail(vender));
  };

  export const update = async (
    token: string,
    product_id: string,
    input: IProduct.UpdateInput,
  ): Promise<IProduct.Detail> => {
    const product = await _findOne(ProductRepository.findOne)(product_id);
    const vender = await ProductService.getAuthorizedVender(token, product);
    return _execute(
      Product.update(product, input),
      ProductRepository.update,
      _toDetail(vender),
    );
  };

  export const inActivate = async (
    token: string,
    product_id: string,
  ): Promise<void> => {
    const product = await _findOne(ProductRepository.findOne)(product_id);
    await ProductService.getAuthorizedVender(token, product);
    return _execute(
      Product.inActivate(product),
      ProductRepository.update,
      () => {},
    );
  };
}
