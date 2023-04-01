import { ifSuccess, pipeAsync } from '@UTIL';
import { IProduct } from '@INTERFACE/product';
import { VenderService } from '@USER/service';
import { ForbiddenUpdateProduct } from '@PRODUCT/core';
import { getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';

export namespace ProductService {
  export const getAuthorizedVender: (
    token: string,
    product: IProduct,
  ) => Promise<
    TryCatch<
      IProduct.Vender,
      IFailure.Business.Forbidden | IFailure.Business.Invalid
    >
  > = (token, product) =>
    pipeAsync(
      VenderService.getVenderByToken,

      ifSuccess((vender: IProduct.Vender) =>
        product.vender_id !== vender.id
          ? ForbiddenUpdateProduct
          : getTry(vender),
      ),
    )(token);
}
