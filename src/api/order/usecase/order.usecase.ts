import { getTry } from '@COMMON/exception';
import { IFailure, Mutable, Try, TryCatch } from '@INTERFACE/common';
import { IOrder, IPaidOrder, IPayment, IUnpaidOrder } from '@INTERFACE/order';
import { AuthenticationService } from '@USER/service';
import { isBusiness, isBusinessInvalid } from '@UTIL';
import { ForbiddenOrder, Order, OrderRepository } from '../core';
import { OrderService, PaymentService } from '@ORDER/service';

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

  export const confirm = async (
    token: string,
    order_id: string,
    input: IOrder.IPaymentConfirmBody,
  ): Promise<
    TryCatch<
      IPaidOrder,
      | IFailure.Business.Invalid
      | IFailure.Business.NotFound
      | IFailure.Business.Forbidden
    >
  > => {
    const payload = AuthenticationService.getAccessTokenPayload(token);
    if (isBusinessInvalid(payload)) return payload;
    const orderer_id = payload.data.id;

    const order = await OrderRepository.findOne(order_id);
    if (isBusiness(order)) return order;
    if (order.data.orderer_id !== orderer_id) return ForbiddenOrder;

    const payment = await PaymentService.findOne(input.transaction_id);
    (order.data as Mutable<IPaidOrder>).status = 'paid';
    (order.data as Mutable<IPaidOrder>).payment = {
      status: payment.status === 'paid' ? 'paid' : 'failed',
      amount: payment.amount,
      transaction_id: input.transaction_id,
      pay_method: 'trans',
      bank_code: payment.pay_method === 'vbank' ? payment.vbank_code : '',
      bank_name: payment.pay_method === 'vbank' ? payment.vbank_name : '',
    };

    return order as Try<IPaidOrder>;
  };
}
