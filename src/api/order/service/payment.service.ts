import { Configuration } from '@INFRA/config';
import imp from 'iamport-server-api';

export namespace PaymentService {
  const { PORTONE_HOST, PORTONE_KEY, PORTONE_SECRET } = Configuration;
  export const connector = new imp.IamportConnector(PORTONE_HOST, {
    imp_key: 'test_imp_key',
    imp_secret: 'test_imp_secret',
  });

  /**
   * 결제 기록 조회
   *
   * @param imp_uid
   * @returns 결제 기록
   */
  export const findOne = async (imp_uid: string) =>
    imp.functional.payments
      .at(await connector.get(), imp_uid)
      .then(({ response }) => response);
}
