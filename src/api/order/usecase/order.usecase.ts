import { getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { IOrder, IUnpaidOrder } from '@INTERFACE/order';
import { AuthenticationService } from '@USER/service';
import { isBusinessInvalid } from '@UTIL';
import { Order, OrderRepository } from '../core';
import { OrderService } from '@ORDER/service';

export namespace OrderUsecase {
  export const create = async (
    token: string,
    input: IOrder.ICreateBody,
  ): Promise<TryCatch<IUnpaidOrder, IFailure.Business.Invalid>> => {
    const payload = AuthenticationService.getAccessTokenPayload(token);
    if (isBusinessInvalid(payload)) return payload;
    const orderer_id = payload.data.id;

    const list = await OrderService.createOrderItemList(input.order_item_list);

    if (isBusinessInvalid(list)) return list;

    const order = Order.create({
      orderer_id,
      recipient: input.recipient,
      order_item_list: list.data,
    });
    await OrderRepository.add(order);
    return getTry(order);
  };
}
