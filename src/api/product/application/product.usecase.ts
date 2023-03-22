import { TransactionMarker } from '@COMMON/decorator/lazy';
import { HttpExceptionFactory } from '@COMMON/exception';
import {
  IProduct,
  IProductRepository,
  IProductUsecase,
} from '@INTERFACE/product';
import { Product, ProductMapper } from '@PRODUCT/domain';
import { Nullish, ProviderBuilder } from '@UTIL';

export const ProductUsecaseFactory = (
  repository: IProductRepository,
): IProductUsecase => {
  const _findOne = async (product_id: string): Promise<IProduct> => {
    const product = await repository.findOne(product_id);
    if (Nullish.is(product)) {
      throw HttpExceptionFactory('NotFound');
    }
    return product;
  };

  return ProviderBuilder<IProductUsecase>({
    async findOne(product_id) {
      const product = await _findOne(product_id);
      return ProductMapper.toDetail(product, {
        id: product.store_id,
        name: '가게 정보를 불러오지 못했습니다.',
      });
    },
    async findMany(page) {
      const [list, total_count] = await repository.findMany(page);
      const getStoreList = (_products: IProduct[]) =>
        Array.from(
          new Set(_products.map((_product) => _product.store_id)),
        ).map<IProduct.Store>((id) => ({ id, name: '' }));

      const store_list = await Promise.all(getStoreList(list));

      const data: IProduct.Summary[] = list
        .map((product) => {
          const store = store_list.find((str) => str.id === product.store_id);
          return ProductMapper.toSummary(
            product,
            store ?? {
              id: product.store_id,
              name: '가게 정보를 불러오지 못했습니다.',
            },
          );
        })
        .filter((summary) => summary.store.id !== 'null');

      return { data, page, total_count };
    },
    async create(input) {
      // store 상태 확인 로직 추가
      const exist = await repository.findOne(input.id);
      if (exist) {
        // id 중복
        throw HttpExceptionFactory('BadRequest', '이미 존재하는 상품입니다.');
      }
      const product = Product.create(input);
      await repository.save(product);
    },
    async update(product_id, input) {
      const product = await _findOne(product_id);
      await repository.save(Product.update(product, input));
      return;
    },
    async inActivate(product_id) {
      const product = await _findOne(product_id);
      await repository.save(Product.inActivate(product));
      return;
    },
  })
    .mark('create', TransactionMarker())
    .build();
};
