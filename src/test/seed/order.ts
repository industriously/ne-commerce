import typia from 'typia';
import { IOrder } from '@INTERFACE/order';
import { SeedProduct } from './product';
import { Order, OrderRepository } from '@ORDER/core';
import { SeedUser } from './user';
import { OrderService } from '@ORDER/service';
import { flatten, isSuccess } from '@UTIL';

export namespace SeedOrder {
  export const unpaid_order1 = Order.randomId();
  export const unpaid_order2 = Order.randomId();
  export const seed = async () => {
    const list1 = await OrderService.createOrderItemList([
      { product_id: SeedProduct.product1, quantity: 10 },
    ]);
    const list2 = await OrderService.createOrderItemList([
      { product_id: SeedProduct.product2, quantity: 5 },
      { product_id: SeedProduct.product3, quantity: 15 },
    ]);
    if (!isSuccess(list1) || !isSuccess(list2)) throw Error('fail');
    const order1 = Order.create({
      orderer_id: SeedUser.customer_id,
      recipient: typia.random<IOrder.IRecipient>(),
      order_item_list: flatten(list1),
    });
    const order2 = Order.create({
      orderer_id: SeedUser.customer_id,
      recipient: typia.random<IOrder.IRecipient>(),
      order_item_list: flatten(list2),
    });
    (order1 as any).id = unpaid_order1;
    (order2 as any).id = unpaid_order2;
    await OrderRepository.add(order1);
    await OrderRepository.add(order2);
    return;
  };
}
