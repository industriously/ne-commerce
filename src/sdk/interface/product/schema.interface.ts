/**
 * 상품 애그리거트
 *
 * 상품 도메인의 트랜잭션 단위
 */
export interface IProduct {
  /**
   * 상품 고유 id
   *
   * @pattern ^[\w|\d]{10}$
   */
  readonly id: string;
  /**
   * 상품명
   */
  readonly name: string;
  /**
   * 상품 가격(원)
   *
   * @type uint
   * @minimum 0
   */
  readonly price: number;
  /**
   * 상품 설명
   */
  readonly description: string;
  /**
   * 판매자 id
   *
   * @type uuid
   */
  readonly vender_id: string;
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
  export interface Summary
    extends Pick<
      IProduct,
      'id' | 'name' | 'price' | 'description' | 'created_at'
    > {
    readonly vender: Vender;
  }

  export type Detail = Summary & Pick<IProduct, 'is_deleted' | 'updated_at'>;

  export type CreateInput = Pick<
    IProduct,
    'name' | 'price' | 'description' | 'vender_id'
  >;

  export interface CreateBody extends Omit<CreateInput, 'vender_id'> {}

  export interface UpdateInput
    extends Partial<Pick<IProduct, 'name' | 'price' | 'description'>> {}

  export interface Vender {
    readonly id: string;
    readonly name: string;
  }
}
