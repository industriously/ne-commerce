import { Try } from '@INTERFACE/common';
import { IOrder, IPaidOrder, IUnpaidOrder } from '@INTERFACE/order';
import { IConnection } from '@nestia/fetcher';
import { orders } from '@SDK/index';
import { getConnectionWithToken } from '@test/internal';
import typia from 'typia';

const api =
  (order_id: string, body: IOrder.IPaymentConfirmBody) =>
  (connection: IConnection) =>
  (token: string) =>
    orders.payment.comfirm(
      getConnectionWithToken(connection, token),
      order_id,
      body,
    );

/** 
export const test_orders_payment_confirm_success = async (
  connection: IConnection,
) => {
  const unpaid_order_id = '';
  const paid_order_id = '';
  const orderer_token = '';
  const unpaid_transaction_id = '';
  const paid_transaction_id = '';

  const received1 = await api(unpaid_order_id, {
    transaction_id: unpaid_transaction_id,
  })(connection)(orderer_token);

  const received2 = await api(paid_order_id, {
    transaction_id: paid_transaction_id,
  })(connection)(orderer_token);

  typia.assertEquals<Try<IUnpaidOrder>>(received1);
  typia.assertEquals<Try<IPaidOrder>>(received2);
};

*/
