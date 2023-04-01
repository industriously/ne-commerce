import { Authorization, TypedQuery } from '@COMMON/decorator/http';
import {
  IFailure,
  Page,
  PaginatedResponse,
  Try,
  TryCatch,
} from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { TypedBody, TypedParam } from '@nestia/core';
import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProductUsecase } from '@PRODUCT/usecase';
import typia from 'typia';

@Controller('products')
export class ProductsController {
  /**
   * 전체 상품 목록 조회
   *
   * @summary 상품 목록 조회 API
   * @tag products
   * @param page 페이지 정보 1이상의 정수, default 1
   * @returns 상품 목록
   * @throw 400 Value of the URL query 'page' is not a valid format.
   */
  @Get()
  async findMany(
    @TypedQuery('page', typia.createIs<Page>(), { type: 'number' })
    page?: number,
  ): Promise<Try<PaginatedResponse<IProduct.Summary>>> {
    return ProductUsecase.findMany(page ?? 1);
  }

  /**
   * @summary 상품 상세 조회 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @returns 상품 상세 정보
   */
  @Get(':product_id')
  async findOne(
    @TypedParam('product_id') product_id: string,
  ): Promise<TryCatch<IProduct.Detail, IFailure.Business.NotFound>> {
    return ProductUsecase.findOne(product_id);
  }

  /**
   * @summary 상품 생성 요청 API
   * @tag products
   * @param body 상품 생성 정보
   * @returns 생성한 상품 상세 정보
   * @throw 400 Request body data is not following the promised type.
   */
  @Post()
  async create(
    @Authorization('bearer') token: string,
    @TypedBody() body: IProduct.CreateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      IFailure.Business.Invalid | IFailure.Business.Forbidden
    >
  > {
    typia.prune(body);
    return ProductUsecase.create(token, body);
  }

  /**
   * @summary 상품 수정 요청 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @param body 변경할 상품 정보
   * @returns 변경된 상품 상세 정보
   * @throw 400 Request body data is not following the promised type.
   */
  @Patch(':product_id')
  async update(
    @Authorization('bearer') token: string,
    @TypedParam('product_id') product_id: string,
    @TypedBody() body: IProduct.UpdateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | IFailure.Business.Forbidden
      | IFailure.Business.NotFound
      | IFailure.Business.Invalid
    >
  > {
    typia.prune(body);
    return ProductUsecase.update(token, product_id, body);
  }

  /**
   * @summary 상품 삭제(비활성화) 요청 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @returns true
   */
  @Delete(':product_id')
  async inActivate(
    @Authorization('bearer') token: string,
    @TypedParam('product_id') product_id: string,
  ): Promise<
    TryCatch<
      true,
      | IFailure.Business.Forbidden
      | IFailure.Business.NotFound
      | IFailure.Business.Invalid
    >
  > {
    return ProductUsecase.inActivate(token, product_id);
  }
}
