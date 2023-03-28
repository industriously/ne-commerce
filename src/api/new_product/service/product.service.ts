import { HttpExceptionFactory } from '@COMMON/exception';
import { IProduct } from '@INTERFACE/product';
import { VenderService } from '@USER/service';

export namespace ProductService {
  export const getAuthorizedVender = async (
    token: string,
    product: IProduct,
  ): Promise<IProduct.Vender> => {
    const vender = await VenderService.getVenderByToken(token);
    if (product.vender_id !== vender.id) {
      throw HttpExceptionFactory('Forbidden');
    }
    return vender;
  };
}
