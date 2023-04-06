import { Authorization } from '@COMMON/decorator/http';
import { IFailure, PaginatedResponse, Try, TryCatch } from '@INTERFACE/common';
import { IOrder, IPaidOrder, IUnpaidOrder } from '@INTERFACE/order';
import { TypedBody, TypedParam } from '@nestia/core';
import { Controller, Get, Post } from '@nestjs/common';
import { OrderUsecase } from '../order/usecase';

@Controller('orders')
export class OrdersController {
  /**
   * @summary 주문 목록 조회 API
   * @tag orders
   * @returns 주문 정보 목록
   */
  @Get()
  findMany(
    @Authorization('bearer') token: string,
  ): Promise<Try<PaginatedResponse<IPaidOrder>>> {
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
    @TypedBody() body: IOrder.ICreateBody,
  ): Promise<TryCatch<IUnpaidOrder, IFailure.Business.Invalid>> {
    return OrderUsecase.create(token, body);
  }

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
    TryCatch<
      IOrder,
      | IFailure.Business.NotFound
      | IFailure.Business.Invalid
      | IFailure.Business.Forbidden
    >
  > {
    throw Error();
  }

  /**
   * 외부 결제 서비스와 연동하여 결제 완료를 확인하고 그에 따라 주문 정보를 갱신한다.
   *
   * @summary 결제 확인 API
   * @tag orders
   * @param order_id 주문 번호
   * @param body 주문 번호와 결제 서비스 고유 번호
   * @returns 주문 상세 정보
   */
  @Post(':order_id/payment')
  comfirm(
    @Authorization('bearer') token: string,
    @TypedParam('order_id') order_id: string,
    @TypedBody() body: IOrder.IPaymentConfirmBody,
  ): Promise<
    TryCatch<
      IPaidOrder,
      | IFailure.Business.Invalid
      | IFailure.Business.NotFound
      | IFailure.Business.Forbidden
    >
  > {
    return OrderUsecase.confirm(token, order_id, body);
  }
}
