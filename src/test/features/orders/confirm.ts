import { Try } from '@INTERFACE/common';
import { IOrder, IPaidOrder } from '@INTERFACE/order';
import { IConnection } from '@nestia/fetcher';
import { PaymentService } from '@ORDER/service';
import { orders } from '@SDK/index';
import { getConnectionWithToken } from '@test/internal';
import { AccessToken, SeedOrder } from '@test/seed';
import imp from 'iamport-server-api';
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

console.log('  - --');

export const test_orders_payment_confirm_success = async (
  connection: IConnection,
) => {
  const unpaid_order_id = SeedOrder.unpaid_order1;
  const orderer_token = AccessToken.customer;

  const connect = await PaymentService.connector.get();
  const ready = await imp.functional.vbanks.store(connect, {
    merchant_uid: unpaid_order_id,
    amount: 4000,
    vbank_code: 'ABCDEFGH',
    vbank_due: Date.now() / 1000 + 7 * 24 * 60 * 60,
    vbank_holder: 'testuser',
  });

  imp.functional.internal.deposit(connect, ready.response.imp_uid);

  const received = await api(unpaid_order_id, {
    transaction_id: ready.response.imp_uid,
  })(connection)(orderer_token);

  console.log(received);
  typia.assertEquals<Try<IPaidOrder>>(received);
};
