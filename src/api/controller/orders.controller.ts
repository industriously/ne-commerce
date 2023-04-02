import { Authorization } from '@COMMON/decorator/http';
import { IFailure, TryCatch } from '@INTERFACE/common';
import {
  IOrder,
  IOrderWithPayment,
  IOrderWithoutPayment,
} from '@INTERFACE/order';
import { TypedBody, TypedParam } from '@nestia/core';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  /**
   * @summary 단건 주문 조회 API
   * @tag orders
   * @param order_id 주문 번호
   * @returns 주문 정보
   */
  @Get(':order_id')
  findOne(
    @Authorization('bearer') token: string,
    @TypedParam('order_id') order_id: string,
  ): Promise<
    TryCatch<IOrder, IFailure.Business.NotFound | IFailure.Business.Invalid>
  > {
    throw Error();
  }

  /**
   * PortOne에서 처리 후, 결제 상태를 확정하는 API
   *
   * @summary 결제 완료 처리 API
   * @tag orders
   * @param order_id 주문 번호
   * @param body 주문 번호와 결제 서비스 고유 번호
   * @returns 주문 상세 정보
   */
  @Post(':order_id')
  complete(
    @Authorization('bearer') token: string,
    @TypedParam('order_id') order_id: string,
    @TypedBody() body: IOrderWithPayment.ICreate,
  ): Promise<
    TryCatch<
      IOrderWithPayment,
      IFailure.Business.Invalid | IFailure.Business.NotFound
    >
  > {
    throw Error();
  }

  /**
   * @summary 주문 생성 API
   * @tag orders
   * @param body 배송정보와 주문 상품 목록을 포함한다.
   * @returns 생성된 주문 정보
   */
  @Post()
  create(
    @Authorization('bearer') token: string,
    @TypedBody() body: IOrder.CreateOrderBody,
  ): Promise<TryCatch<IOrderWithoutPayment, IFailure.Business.Invalid>> {
    throw Error();
  }
}
