/**
 * 상품 애그리거트
 *
 * 상품 도메인의 트랜잭션 단위
 */
export interface IProduct {
  /**
   * 상품 고유 번호
   */
  readonly id: string;
  /**
   * 상품명
   */
  readonly name: string;
  /**
   * 상품 가격(원)
   * @type uint
   * @minimum 0
   */
  readonly price: number;
  /**
   * 상품 설명
   */
  readonly description: string;
  /**
   * 판매점 간단 정보
   */
  readonly store: IProduct.Store;
  /**
   * 구매 가능 상태
   */
  readonly is_deleted: boolean;
  /**
   * 상품 정보 생성 일시(ISO 8601 형식)
   * @pattern ^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).[0-9]{3}Z$
   */
  readonly created_at: string;
  /**
   * 상품 정보 최근 수정 일시(ISO 8601 형식)
   * @pattern ^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).[0-9]{3}Z$
   */
  readonly updated_at: string;
}

export namespace IProduct {
  export type Summary = Pick<
    IProduct,
    'id' | 'name' | 'price' | 'description' | 'store' | 'created_at'
  >;

  export interface CreateInput
    extends Pick<IProduct, 'name' | 'price' | 'description'> {
    readonly store_id: string;
  }

  export interface UpdateInput
    extends Partial<
      Pick<IProduct, 'name' | 'price' | 'description' | 'is_deleted'>
    > {}

  export interface Store {
    readonly id: string;
    readonly name: string;
  }
}
