import { TypedQuery } from '@COMMON/decorator/http';
import { Page, PaginatedResponse } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import { TypedParam } from '@nestia/core';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import typia from 'typia';

@Controller('products')
export class ProductsController {
  /**
   * 상품 목록 조회 API
   *
   * 전체 상품 목록 조회
   *
   * 나중에 필터링 기준, 정렬 기준 추가할 것
   *
   * @tag product
   * @param page 페이지 정보, default 1
   * @returns 페이지 정보와 함께 요청한 상품 목록
   */
  @Get()
  findMany(
    @TypedQuery('page', typia.createIs<Page>(), { type: 'number' })
    page?: number,
  ): Promise<PaginatedResponse<IProduct.Summary>> {
    throw Error();
  }

  /**
   * 상품 상세 조회 API
   *
   * @param product_id 대상 상품 고유 번호
   */
  @Get(':product_id')
  findOne(
    @TypedParam('product_id', 'string') product_id: string,
  ): Promise<IProduct> {
    throw Error();
  }

  /**
   * 상품 생성 요청 API
   *
   * @tag product
   * @param body 상품 생성 정보
   */
  @Post()
  create(@Body() body: IProduct.CreateInput): Promise<void> {
    const input = typia.assertPrune(body);
    throw Error();
  }

  /**
   * 상품 수정 요청 API
   *
   * @tag product
   * @param product_id 대상 상품 고유 번호
   * @param body 변경할 상품 정보
   */
  @Patch(':product_id')
  update(
    @TypedParam('product_id', 'string') product_id: string,
    @Body() body: IProduct.UpdateInput,
  ): Promise<void> {
    const input = typia.assertPrune(body);
    throw Error();
  }

  /**
   * 상품 삭제(비활성화) 요청 API
   *
   * @tag product
   * @param product_id 대상 상품 고유 번호
   */
  @Delete(':product_id')
  inActivate(
    @TypedParam('product_id', 'uuid') product_id: string,
  ): Promise<void> {
    throw Error();
  }
}
