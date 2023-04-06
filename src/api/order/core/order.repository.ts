import { getTry } from '@COMMON/exception';
import { _findMany, _findOne } from '@COMMON/repository';
import { prisma } from '@INFRA/DB';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { IOrder, IUnpaidOrder } from '@INTERFACE/order';
import { identity } from 'rxjs';
import { NotFoundOrder } from './exception';
import { getISOString, isBusinessNotFound, isNull, map } from '@UTIL';

export namespace OrderRepository {
  export const add = async (
    order: IUnpaidOrder,
  ): Promise<Try<IUnpaidOrder>> => {
    const order_item_datas = order.order_item_list.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    await prisma.order.create({
      data: {
        id: order.id,
        status: order.status,
        orderer_id: order.orderer_id,
        recipient_name: order.recipient.name,
        recipient_address: order.recipient.address,
        recipient_phone: order.recipient.phone,
        is_deleted: order.is_deleted,
        created_at: order.created_at,
        updated_at: order.updated_at,
      },
    });

    await prisma.orderItem.createMany({ data: order_item_datas });

    return getTry(order);
  };

  export const findOne = async (
    order_id: string,
  ): Promise<
    TryCatch<IOrder, IFailure.Business.NotFound | IFailure.Business.Invalid>
  > => {
    const _order = await prisma.order.findFirst({
      where: { id: order_id, is_deleted: false },
    });
    if (isNull(_order)) {
      return NotFoundOrder;
    }
    const item_list = await prisma.orderItem.findMany({
      where: { order_id: _order.id },
    });
    const order_item_list = item_list.map<IOrder.IOrderItem>((item) => ({
      id: item.id,
      quantity: item.quantity,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
    }));
    const order: IUnpaidOrder = {
      payment: null,
      status: _order.status as 'unpaid', // as IOrder.Status,
      id: _order.id,
      order_item_list,
      orderer_id: _order.orderer_id,
      recipient: {
        name: _order.recipient_name,
        address: _order.recipient_address,
        phone: _order.recipient_phone,
      },
      is_deleted: false,
      created_at: getISOString(_order.created_at),
      updated_at: getISOString(_order.updated_at),
    };
    return getTry(order);
  };
}
