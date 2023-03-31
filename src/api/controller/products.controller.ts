import { Authorization } from '@COMMON/decorator/http';
import { Failure } from '@COMMON/exception';
import { IFailure, Page, PaginatedResponse, TryCatch } from '@INTERFACE/common';
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
   */
  @Get()
  async findMany(
    @Query('page') page?: string,
  ): Promise<
    TryCatch<PaginatedResponse<IProduct.Summary>, IFailure.Business.Invalid>
  > {
    const npage = Number(page ?? 1);
    if (isNaN(npage) || !typia.is<Page>({ page: npage }))
      return Failure.Business.InvalidQuery;
    return ProductUsecase.findMany(npage);
  }

  /**
   * @summary 상품 상세 조회 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @returns 상품 상세 정보
   */
  @Get(':product_id')
  async findOne(
    @Param('product_id') product_id: string,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      IFailure.Business.Invalid | IFailure.Business.NotFound
    >
  > {
    if (!typia.is(product_id)) return Failure.Business.InvalidParam;
    return ProductUsecase.findOne(product_id);
  }

  /**
   * @summary 상품 생성 요청 API
   * @tag products
   * @param body 상품 생성 정보
   * @returns 생성한 상품 상세 정보
   */
  @Post()
  async create(
    @Authorization('bearer') token: string,
    @Body() body: IProduct.CreateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      IFailure.Business.Invalid | IFailure.Business.Forbidden
    >
  > {
    if (!typia.isPrune(body)) return Failure.Business.InvalidBody;
    return ProductUsecase.create(token, body);
  }

  /**
   * @summary 상품 수정 요청 API
   * @tag products
   * @param product_id 대상 상품 고유 번호
   * @param body 변경할 상품 정보
   * @returns 변경된 상품 상세 정보
   */
  @Patch(':product_id')
  async update(
    @Authorization('bearer') token: string,
    @Param('product_id') product_id: string,
    @Body() body: IProduct.UpdateInput,
  ): Promise<
    TryCatch<
      IProduct.Detail,
      | IFailure.Business.Forbidden
      | IFailure.Business.NotFound
      | IFailure.Business.Invalid
    >
  > {
    if (!typia.isPrune(body)) return Failure.Business.InvalidBody;
    if (!typia.is(product_id)) return Failure.Business.InvalidParam;
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
    @Param('product_id') product_id: string,
  ): Promise<
    TryCatch<
      true,
      | IFailure.Business.Forbidden
      | IFailure.Business.NotFound
      | IFailure.Business.Invalid
    >
  > {
    if (!typia.is(product_id)) return Failure.Business.InvalidParam;
    return ProductUsecase.inActivate(token, product_id);
  }
}
