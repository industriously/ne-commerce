import { Failure } from '@COMMON/exception';
import { TryCatch, IFailure } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersUsecase } from '@USER/usecase';
import typia from 'typia';

@Controller('users')
export class UsersController {
  /**
   * 활성화된 사용자의 정보만 조회합니다.
   *
   * @summary 사용자 프로필 조회 API
   * @tag users
   * @param user_id 조회 대상의 id 입니다.
   * @returns 사용자 공개 정보
   */
  @Get(':user_id')
  async findOne(
    @Param('user_id') id: string,
  ): Promise<
    TryCatch<
      IUser.Public,
      IFailure.Business.NotFound | IFailure.Business.Invalid
    >
  > {
    if (typia.is(id)) return Failure.Business.InvalidParam;
    return UsersUsecase.findOne(id);
  }
}
