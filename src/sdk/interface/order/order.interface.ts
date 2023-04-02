import {
  IOrderWithPayment,
  IOrderWithoutPayment,
} from './order-payment.interface';

export type IOrder = IOrderWithoutPayment | IOrderWithPayment;

export namespace IOrder {
  export interface IBase {
    readonly id: string;
    readonly order_item_list: IOrder.IOrderItem[];
    /**
     * @type uint
     * @minimum 0
     */
    readonly total_price: number;
    readonly orderer_id: string;
    readonly destination: IOrder.IDestination;
    readonly status: IOrder.OrderStatus;
    readonly payment_status: IOrder.PaymentStatus;
    // 결제와 주문은 1:1이므로 추가 결제 정보를 저장하기 위한 결제 테이블은 order_id를 PK로 한다.
    /**
     * ISO 8601 type
     *
     * @pattern ^(19[6-9][0-9]|2[0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\.[0-9]{3}Z$
     */
    readonly created_at: string;
    /**
     * ISO 8601 type
     *
     * @pattern ^(19[6-9][0-9]|2[0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\.[0-9]{3}Z$
     */
    readonly updated_at: string;
  }
  export type PaymentStatus = 'unpaid' | 'paid';
  export type OrderStatus =
    | 'created' // 주문 생성 상태
    | 'on hold' // 결제 처리 과정에서 문제가 발생한 경우
    | 'processing' // 결제 완료 후, 상품 준비 / 배송 준비 단계
    | 'delivering' // 배송중
    | 'delivered' // 배송 완료
    | 'completed'; // 구매 확정 단계, 이후는 환불/취소 못함
  // | 'cancelled' // 주문 취소됨
  // | 'refunded' // 환불 됨

  export interface IOrderItem {
    readonly id: string;
    readonly product_id: string;
    readonly product_name: string;
    /**
     * @type uint
     * @minimum 0
     */
    readonly product_price: number;
    readonly vender_id: string;
    readonly vender_name: string;
    /**
     * @type uint
     * @minimum 1
     */
    readonly quantity: number;
  }
  export interface IDestination {
    readonly name: string;
    readonly address: string;
    readonly phone: string;
  }

  export type ICreateOrderItem = Pick<IOrderItem, 'product_id' | 'quantity'>;
  export type ICreate = Pick<
    IOrder,
    'destination' | 'orderer_id' | 'order_item_list'
  >;

  export interface CreateOrderBody {
    readonly destination: IDestination;
    readonly order_item_list: ICreateOrderItem[];
  }
}
