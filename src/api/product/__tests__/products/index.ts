import { IProduct } from '@INTERFACE/product';
import { IConnection } from '@nestia/fetcher';
import { Product } from '@PRODUCT/domain';
import { AccessToken, SeedProduct } from 'src/api/__tests__/seed';
import typia from 'typia';
import { create } from './create';
import { findMany } from './find_many';
import { findOne } from './find_one';
import { inActivate } from './in_activate';
import { update } from './update';

export namespace TestProducts {
  export const test_create = (connection: IConnection) => () => {
    const test_bodys = [
      typia.random<IProduct.CreateBody>(),
      typia.random<IProduct.CreateBody>(),
    ];
    it.each(AccessToken.invalid_list)(
      'If token invalid',
      create.test_invalid_token(connection, test_bodys[0]),
    );

    it.each([AccessToken.normal])(
      'If user is not vender',
      create.test_permission_fail(connection, test_bodys[0]),
    );

    it.each(test_bodys)(
      'If user is vender',
      create.test_success(connection, AccessToken.vender),
    );
  };

  export const test_findMany = (connection: IConnection) => () => {
    it.each([-1, 0, 2.4])(
      'findMany products by invalid page',
      findMany.test_not_int(connection),
    );
    it.each([1, undefined, 2])(
      'findMany products by int page',
      findMany.test_success(connection),
    );
  };

  export const test_findOne = (connection: IConnection) => () => {
    it.each([SeedProduct.product1, SeedProduct.product2, SeedProduct.product3])(
      'If product is exist',
      findOne.test_success(connection),
    );
    it.each([Product.randomId(10), Product.randomId(10), Product.randomId(10)])(
      'If product is not exist',
      findOne.test_product_not_found(connection),
    );
  };

  export const test_update = (connection: IConnection) => () => {
    const test_bodys = [
      typia.random<IProduct.UpdateInput>(),
      typia.random<IProduct.UpdateInput>(),
      typia.random<IProduct.UpdateInput>(),
    ];
    it.each(AccessToken.invalid_list)(
      'If token invalid',
      update.test_invalid_token(
        connection,
        SeedProduct.product1,
        test_bodys[0],
      ),
    );
    it.each([Product.randomId(10), Product.randomId(10), Product.randomId(10)])(
      'If product is not exist',
      update.test_product_not_found(
        connection,
        AccessToken.vender,
        test_bodys[0],
      ),
    );

    it.each([AccessToken.normal, AccessToken.vender2])(
      'If user does not have permission',
      update.test_permission_fail(
        connection,
        SeedProduct.product1,
        test_bodys[0],
      ),
    );

    it.each(test_bodys)(
      'If user have permission',
      update.test_success(connection, AccessToken.vender, SeedProduct.product1),
    );
  };

  export const test_inActivate = (connection: IConnection) => () => {
    it.each(AccessToken.invalid_list)(
      'If token invalid',
      inActivate.test_invalid_token(connection, SeedProduct.product1),
    );
    it.each([Product.randomId(10), Product.randomId(10), Product.randomId(10)])(
      'If product is not exist',
      inActivate.test_product_not_found(connection, AccessToken.vender),
    );

    it.each([AccessToken.normal, AccessToken.vender2])(
      'If user does not have permission',
      inActivate.test_permission_fail(connection, SeedProduct.product1),
    );

    it.each([SeedProduct.product1, SeedProduct.product2, SeedProduct.product3])(
      'If user have permission',
      inActivate.test_success(connection, AccessToken.vender),
    );
  };
}
