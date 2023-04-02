import { IOrder } from './order.interface';

export interface IOrderWithPayment extends IOrder.IBase {
  /**
   * PortOne info
   */
  readonly payment: IOrderWithPayment.IPayment;
}

export namespace IOrderWithPayment {
  export interface IPayment {
    readonly id: string;
    readonly amount: number;
    // 결제 관련 정보 -> 포트원 서비스에서 관리하는 자원
  }

  export interface ICreate {
    payment_id: string;
  }
}

export interface IOrderWithoutPayment extends IOrder.IBase {
  readonly payment_status: 'unpaid';
  readonly payment: null;
}
