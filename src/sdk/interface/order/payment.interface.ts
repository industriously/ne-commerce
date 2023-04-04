export type IPayment = IPayment.ByCard | IPayment.ByTrans;

export namespace IPayment {
  export type Status = 'paid' | 'failed' | 'cancelled';
  export type Method = 'card' | 'trans';
  export interface IBase<M extends Method> {
    readonly pay_method: M;
    readonly status: Status;
    readonly amount: number;
    readonly transaction_id: string;
  }
  export interface ByCard extends IBase<'card'> {
    readonly card_code: string;
    readonly card_name: string;
    readonly card_number: string;
    readonly apply_num: string;
  }
  export interface ByTrans extends IBase<'trans'> {
    readonly bank_code: string;
    readonly bank_name: string;
  }
}
