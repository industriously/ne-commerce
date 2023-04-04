import { Configuration } from '@INFRA/config';
import imp from 'iamport-server-api';

export namespace PortOne {
  const { PORTONE_HOST, PORTONE_KEY, PORTONE_SECRET } = Configuration;
  const connector = new imp.IamportConnector(PORTONE_HOST, {
    imp_key: PORTONE_KEY,
    imp_secret: PORTONE_SECRET,
  });

  /**
   * 결제 기록 조회
   *
   * @param imp_uid
   * @returns 결제 기록
   */
  export const findOne = async (imp_uid: string) =>
    imp.functional.payments.at(await connector.get(), imp_uid);
}
