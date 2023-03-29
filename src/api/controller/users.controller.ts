import { TryCatch } from '@INTERFACE/common';
import { Exception } from '@COMMON/exception';
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
   * @throw 4003 유효하지 않은 param입니다.
   * @throw 4006 사용자를 찾을 수 없습니다.
   */
  @Get(':user_id')
  async findOne(
    @Param('user_id') id: string,
  ): Promise<
    TryCatch<
      IUser.Public,
      typeof Exception.INVALID_PARAM | typeof Exception.USER_NOT_FOUND
    >
  > {
    if (typia.is(id)) return Exception.INVALID_PARAM;
    return UsersUsecase.findOne(id);
  }
}
