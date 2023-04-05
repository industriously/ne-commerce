import { getTry } from '@COMMON/exception';
import { prisma } from '@INFRA/DB';
import { Try } from '@INTERFACE/common';
import { IUnpaidOrder } from '@INTERFACE/order';

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
}
