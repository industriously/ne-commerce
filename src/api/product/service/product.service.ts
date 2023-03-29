import { ifSuccess, pipeAsync } from '@UTIL';
import { Exception, getSuccessReturn } from '@COMMON/exception';
import { IProduct } from '@INTERFACE/product';
import { VenderService } from '@USER/service';

export namespace ProductService {
  export const getAuthorizedVender = (token: string, product: IProduct) =>
    pipeAsync(
      VenderService.getVenderByToken,

      (result) =>
        result.code === '4008' ? Exception.FORBIDDEN_PRODUCT_UPDATE : result,

      ifSuccess<
        IProduct.Vender,
        IProduct.Vender,
        typeof Exception.FORBIDDEN_PRODUCT_UPDATE
      >((vender) =>
        product.vender_id !== vender.id
          ? Exception.FORBIDDEN_PRODUCT_UPDATE
          : getSuccessReturn(vender),
      ),
    )(token);
}
