import { getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { IOrder } from '@INTERFACE/order';
import { InvalidOrderItem, Order } from '@ORDER/core';
import { ProductRepository } from '@PRODUCT/core';
import { isNull, isUndefined } from '@UTIL';

export namespace OrderService {
  export const createOrderItemList = async (
    item_list: IOrder.ICreateOrderItem[],
  ): Promise<TryCatch<IOrder.IOrderItem[], IFailure.Business.Invalid>> => {
    const ids = item_list.map(({ product_id }) => product_id);

    const { data: product_list } = await ProductRepository.findManyByIds(ids);

    const order_item_list = item_list.map(({ quantity, product_id }) => {
      const product = product_list.find((item) => item.id === product_id);
      if (isUndefined(product)) return null;
      return Order.createOrderItem({
        quantity,
        product_id,
        product_name: product.name,
        product_price: product.price,
      });
    });
    const include_null = order_item_list.some(isNull);
    if (include_null) return InvalidOrderItem;
    return getTry(order_item_list as IOrder.IOrderItem[]);
  };
}
