import { Authorization, TypedQuery } from '@COMMON/decorator/http';
import { Page, PaginatedResponse } from '@INTERFACE/common';
import { IProduct, IProductUsecase } from '@INTERFACE/product';
import { TypedParam } from '@nestia/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductUsecaseToken } from '@PRODUCT/constants';
import typia from 'typia';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ProductUsecaseToken) private readonly usecase: IProductUsecase,
  ) {}

  /**
   * 전체 상품 목록 조회
   *
   * @summary 상품 목록 조회 API
   * @tag product
   * @param page 페이지 정보 1이상의 정수, default 1
   * @returns 페이지 정보와 함께 요청한 상품 목록
   * @throw 400 Value of the URL query 'page' is invalid.
   */
  @Get()
  findMany(
    @TypedQuery('page', typia.createIs<Page>(), { type: 'number' })
    page?: number,
  ): Promise<PaginatedResponse<IProduct.Summary>> {
    return this.usecase.findMany(page ?? 1);
  }

  /**
   * @summary 상품 상세 조회 API
   * @tag product
   * @param product_id 대상 상품 고유 번호
   * @returns 상품 상세 정보
   * @throw 404 일치하는 대상을 찾지 못했습니다.
   */
  @Get(':product_id')
  findOne(
    @TypedParam('product_id', 'string') product_id: string,
  ): Promise<IProduct.Detail> {
    return this.usecase.findOne(product_id);
  }

  /**
   * @summary 상품 생성 요청 API
   * @tag product
   * @param body 상품 생성 정보
   * @returns 생성한 상품 상세 정보
   * @throw 400 잘못된 토큰입니다.
   * @throw 400 {property} type is invalid.
   * @throw 403 권한이 없습니다.
   */
  @Post()
  create(
    @Authorization('bearer') token: string,
    @Body() body: IProduct.CreateBody,
  ): Promise<IProduct.Detail> {
    const input = typia.assertPrune(body);
    return this.usecase.create(token, input);
  }

  /**
   * @summary 상품 수정 요청 API
   * @tag product
   * @param product_id 대상 상품 고유 번호
   * @param body 변경할 상품 정보
   * @throw 400 잘못된 토큰입니다.
   * @throw 400 {property} type is invalid.
   * @throw 403 권한이 없습니다.
   * @throw 404 일치하는 대상을 찾지 못했습니다.
   */
  @Patch(':product_id')
  update(
    @Authorization('bearer') token: string,
    @TypedParam('product_id', 'string') product_id: string,
    @Body() body: IProduct.UpdateInput,
  ): Promise<void> {
    const input = typia.assertPrune(body);
    return this.usecase.update(token, product_id, input);
  }

  /**
   * @summary 상품 삭제(비활성화) 요청 API
   * @tag product
   * @param product_id 대상 상품 고유 번호
   * @throw 400 잘못된 토큰입니다.
   * @throw 403 권한이 없습니다.
   * @throw 404 일치하는 대상을 찾지 못했습니다.
   */
  @Delete(':product_id')
  inActivate(
    @Authorization('bearer') token: string,
    @TypedParam('product_id', 'string') product_id: string,
  ): Promise<void> {
    return this.usecase.inActivate(token, product_id);
  }
}
