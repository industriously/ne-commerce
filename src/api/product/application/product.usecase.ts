import { TransactionMarker } from '@COMMON/decorator/lazy';
import { HttpExceptionFactory } from '@COMMON/exception';
import {
  IProduct,
  IProductRepository,
  IProductUsecase,
} from '@INTERFACE/product';
import { ITokenService } from '@INTERFACE/token';
import { CommandBus } from '@nestjs/cqrs';
import { Product, ProductMapper } from '@PRODUCT/domain';
import { FindManyVenderCommand, FindVenderCommand } from '@USER/application';
import { Nullish, ProviderBuilder } from '@UTIL';

export const ProductUsecaseFactory = (
  commandBus: CommandBus,
  repository: IProductRepository,
  tokenService: ITokenService,
): IProductUsecase => {
  const _getVenderId = (token: string): string => {
    const payload = tokenService.getAccessTokenPayload(token);
    if (payload.role !== 'vender') {
      throw HttpExceptionFactory('Forbidden');
    }
    return payload.id;
  };
  const _findOne = async (product_id: string): Promise<IProduct> => {
    const product = await repository.findOne(product_id);
    if (Nullish.is(product)) {
      throw HttpExceptionFactory('NotFound');
    }
    return product;
  };

  const _checkUpdatePermission = (token: string, product: IProduct): void => {
    const vender_id = _getVenderId(token);
    if (product.vender_id !== vender_id) {
      throw HttpExceptionFactory('Forbidden');
    }
  };

  const _findVender = (id: string) => {
    return commandBus.execute<FindVenderCommand, IProduct.Vender>(
      new FindVenderCommand(id),
    );
  };

  const _findManyVender = (ids: string[]) => {
    return commandBus.execute<FindManyVenderCommand, IProduct.Vender[]>(
      new FindManyVenderCommand(ids),
    );
  };

  return ProviderBuilder<IProductUsecase>({
    async findOne(product_id) {
      const product = await _findOne(product_id);
      const vender = await _findVender(product.vender_id);
      return ProductMapper.toDetail(product, vender);
    },
    async findMany(page) {
      const [list, total_count] = await Promise.all([
        repository.findMany(page),
        repository.count(),
      ]);
      const getVenderList = (_products: IProduct[]) =>
        _findManyVender(_products.map((_product) => _product.vender_id));

      const vender_list = await getVenderList(list);

      const data: IProduct.Summary[] = list
        .map((product) => {
          const vender = vender_list.find(
            (str) => str.id === product.vender_id,
          );
          return ProductMapper.toSummary(
            product,
            vender ?? {
              id: product.vender_id,
              name: '',
            },
          );
        })
        .filter((summary) => summary.vender.id !== 'null');

      return { data, page, total_count };
    },
    async create(token, input) {
      const vender_id = _getVenderId(token);
      const product = Product.create({ ...input, vender_id });
      await repository.save(product);
    },
    async update(token, product_id, input) {
      const product = await _findOne(product_id);
      _checkUpdatePermission(token, product);
      await repository.save(Product.update(product, input));
      return;
    },
    async inActivate(token, product_id) {
      const product = await _findOne(product_id);
      _checkUpdatePermission(token, product);
      await repository.save(Product.inActivate(product));
      return;
    },
  })
    .mark('create', TransactionMarker())
    .build();
};
