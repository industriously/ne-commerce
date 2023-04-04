import { IPayment } from './payment.interface';

export type IOrder = IUnpaidOrder | IPaidOrder;

export namespace IOrder {
  export type Status =
    | 'unpaid'
    | 'on hold'
    | 'paid'
    | 'processing'
    | 'delivering'
    | 'delivered';
  export interface IBase<S extends Status = Status> {
    readonly status: S;
    readonly id: string;
    readonly order_item_list: IOrderItem[];
    readonly orderer_id: string;
    readonly recipient: IRecipient;
    /**
     * @format datetime
     */
    readonly created_at: string;
    /**
     * @format datetime
     */
    readonly updated_at: string;
    readonly payment: null | IPayment;
  }
  export interface IOrderItem {
    readonly id: string;
    /**
     * @type uint
     * @minimum 1
     */
    readonly quantity: number;
    readonly product_id: string;
    readonly product_name: string;
    /**
     * @type uint
     * @minimum 0
     */
    readonly product_price: number;
  }
  export interface IRecipient {
    readonly name: string;
    readonly address: string;
    readonly phone: string;
  }

  export type ICreateOrderItem = Pick<IOrderItem, 'product_id' | 'quantity'>;
  export type ICreate = Pick<
    IBase,
    'orderer_id' | 'recipient' | 'order_item_list'
  >;
  export interface ICreateBody {
    readonly recipient: IRecipient;
    readonly order_item_list: ICreateOrderItem;
  }
  export interface IPaymentConfirmBody {
    readonly transaction_id: string;
  }
}

export interface IUnpaidOrder extends IOrder.IBase<'unpaid'> {
  readonly payment: null;
}
export interface IPaidOrder<
  S extends Exclude<IOrder.Status, 'unpaid'> = Exclude<IOrder.Status, 'unpaid'>,
> extends IOrder.IBase<S> {
  readonly payment: IPayment;
}
