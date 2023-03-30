import { Authorization } from '@COMMON/decorator/http';
import { Exception } from '@COMMON/exception';
import { Page, PaginatedResponse, TryCatch } from '@INTERFACE/common';
import { IProduct } from '@INTERFACE/product';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
   * @throw 4002 유효하지 않은 query입니다.
   */
  @Get()
  async findMany(
    @Query('page') page?: string,
  ): Promise<
    TryCatch<
      PaginatedResponse<IProduct.Summary>,
      typeof Exception.INVALID_QUERY
    >
  > {
    const npage = Number(page ?? 1);
    if (isNaN(npage) || !typia.is<Page>({ page: npage }))
      return Exception.INVALID_QUERY;
    return ProductUsecase.findMany(npage);
  }

  /**
   * @summary 상품 상세 조회 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @returns 상품 상세 정보
   * @throw 4009 상품을 찾을 수 없습니다.
   */
  @Get(':product_id')
  findOne(
    @Param('product_id') product_id: string,
  ): Promise<TryCatch<IProduct.Detail, typeof Exception.PRODUCT_NOT_FOUND>> {
    return ProductUsecase.findOne(product_id);
  }

  /**
   * @summary 상품 생성 요청 API
   * @tag products
   * @param body 상품 생성 정보
   * @returns 생성한 상품 상세 정보
   * @throw 4001 유효하지 않은 body입니다.
   * @throw 4007 잘못된 토큰입니다.
   * @throw 4008 판매자 권한이 없습니다.
   * @throw 4011 상품 생성에 실패했습니다.
   */
  @Post()
  async create(
    @Authorization('bearer') token: string,
    @Body() body: IProduct.CreateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | typeof Exception.INVALID_BODY
      | typeof Exception.INVALID_TOKEN
      | typeof Exception.FORBIDDEN_VENDER
      | typeof Exception.PRODUCT_CREATE_FAIL
    >
  > {
    if (!typia.isPrune(body)) return Exception.INVALID_BODY;
    return ProductUsecase.create(token, body);
  }

  /**
   * @summary 상품 수정 요청 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @param body 변경할 상품 정보
   * @returns 변경된 상품 상세 정보
   * @throw 4001 유효하지 않은 body입니다.
   * @throw 4007 잘못된 토큰입니다.
   * @throw 4009 상품을 찾을 수 없습니다.
   * @throw 4010 해당 상품의 수정 권한이 없습니다.
   * @throw 4012 상품 수정에 실패했습니다.
   */
  @Patch(':product_id')
  async update(
    @Authorization('bearer') token: string,
    @Param('product_id') product_id: string,
    @Body() body: IProduct.UpdateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | typeof Exception.INVALID_BODY
      | typeof Exception.INVALID_TOKEN
      | typeof Exception.PRODUCT_NOT_FOUND
      | typeof Exception.FORBIDDEN_PRODUCT_UPDATE
      | typeof Exception.PRODUCT_UPDATE_FAIL
    >
  > {
    if (!typia.isPrune(body)) return Exception.INVALID_BODY;
    return ProductUsecase.update(token, product_id, body);
  }

  /**
   * @summary 상품 삭제(비활성화) 요청 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @returns true
   * @throw 4007 잘못된 토큰입니다.
   * @throw 4009 상품을 찾을 수 없습니다.
   * @throw 4010 해당 상품의 수정 권한이 없습니다.
   * @throw 4012 상품 수정에 실패했습니다.
   */
  @Delete(':product_id')
  inActivate(
    @Authorization('bearer') token: string,
    @Param('product_id') product_id: string,
  ): Promise<
    TryCatch<
      true,
      | typeof Exception.INVALID_TOKEN
      | typeof Exception.PRODUCT_NOT_FOUND
      | typeof Exception.FORBIDDEN_PRODUCT_UPDATE
      | typeof Exception.PRODUCT_UPDATE_FAIL
    >
  > {
    return ProductUsecase.inActivate(token, product_id);
  }
}
