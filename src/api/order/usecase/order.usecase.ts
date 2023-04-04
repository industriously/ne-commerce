import { getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { IOrder, IUnpaidOrder } from '@INTERFACE/order';
import { IProduct } from '@INTERFACE/product';
import { ProductRepository } from '@PRODUCT/core';
import { AuthenticationService } from '@USER/service';
import { getISOString, isBusinessInvalid, isNull, isUndefined } from '@UTIL';
import { randomUUID } from 'crypto';

export namespace OrderUsecase {
  const createOrderItemList = (
    list: IOrder.ICreateOrderItem[],
    products: IProduct[],
  ): TryCatch<IOrder.IOrderItem[], IFailure.Business.Invalid> => {
    const order_item_list = list.map(({ quantity, product_id }) => {
      const product = products.find((item) => item.id === product_id);
      if (isUndefined(product)) return null;
      return {
        id: randomUUID(),
        quantity,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
      } satisfies IOrder.IOrderItem;
    });
    const include_null = order_item_list.some(isNull);
    if (include_null)
      return {
        type: 'business',
        event: 'Invalid',
        message: '유효하지 않은 상품입니다.',
      } satisfies IFailure.Business.Invalid;
    return getTry(order_item_list as IOrder.IOrderItem[]);
  };
  export const create = async (
    token: string,
    input: IOrder.ICreateBody,
  ): Promise<TryCatch<IUnpaidOrder, IFailure.Business.Invalid>> => {
    const payload = AuthenticationService.getAccessTokenPayload(token);
    if (isBusinessInvalid(payload)) return payload;
    const orderer_id = payload.data.id;
    const product_ids = input.order_item_list.map((item) => item.product_id);

    const { data: product_list } = await ProductRepository.findManyByIds(
      product_ids,
    );
    const list = createOrderItemList(input.order_item_list, product_list);

    if (isBusinessInvalid(list)) return list;

    return getTry({
      status: 'unpaid',
      id: '',
      order_item_list: list.data,
      payment: null,
      orderer_id,
      recipient: input.recipient,
      created_at: getISOString(),
      updated_at: getISOString(),
    } satisfies IUnpaidOrder);
  };
}
