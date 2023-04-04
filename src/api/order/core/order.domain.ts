import { IOrder, IUnpaidOrder } from '@INTERFACE/order';
import { getISOString } from '@UTIL';
import { randomUUID } from 'crypto';

export namespace Order {
  const ABC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const integer = (end: number) => {
    const temp = Math.floor(Math.random() * end);
    return temp === end ? temp - 1 : temp;
  };
  export const randomId = () => {
    const code = new Array<number>(6)
      .fill(ABC.length)
      .map((end) => ABC[integer(end)]);

    const YYMMDD = getISOString().slice(2, 10).replace(/-/g, '');
    return YYMMDD + code;
  };

  export const create = (input: IOrder.ICreate): IUnpaidOrder => {
    return {
      id: randomId(),
      status: 'unpaid',
      orderer_id: input.orderer_id,
      order_item_list: input.order_item_list,
      recipient: input.recipient,
      payment: null,
      created_at: getISOString(),
      updated_at: getISOString(),
    };
  };

  export const createOrderItem = (
    input: IOrder.ICreateOrderItem &
      Pick<IOrder.IOrderItem, 'product_name' | 'product_price'>,
  ): IOrder.IOrderItem => ({
    id: randomUUID(),
    quantity: input.quantity,
    product_id: input.product_id,
    product_name: input.product_name,
    product_price: input.product_price,
  });
}
