import { TryCatch, IFailure } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { TypedParam } from '@nestia/core';
import { Controller, Get } from '@nestjs/common';
import { UsersUsecase } from '@USER/usecase';

@Controller('users')
export class UsersController {
  /**
   * 활성화된 사용자의 정보만 조회합니다.
   *
   * @summary 사용자 정보 조회 API
   * @tag users
   * @param user_id 조회 대상의 id 입니다.
   * @returns 사용자 공개 정보
   * @throw 400 Value of the URL parameter "user_id" is not a valid UUID.
   */
  @Get(':user_id')
  async findOne(
    @TypedParam('user_id', 'uuid') user_id: string,
  ): Promise<TryCatch<IUser.ISummary, IFailure.Business.NotFound>> {
    return UsersUsecase.findOne(user_id);
  }
}
