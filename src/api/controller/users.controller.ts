import { IUser } from '@INTERFACE/user';
import { TypedParam } from '@nestia/core';
import { Controller, Get } from '@nestjs/common';
import { UsersUsecase } from '@USER/usecase';

@Controller('users')
export class UsersController {
  /**
   * 활성화된 사용자의 정보만 조회합니다.
   *
   * @summary 사용자 프로필 조회 API
   * @tag user
   * @param user_id 조회 대상의 id 입니다. uuid 타입만 허용합니다.
   * @returns 조회한 사용자의 공개 정보를 응답합니다.
   * @throw 400 Value of the URL parameter "user_id" is not a valid UUID.
   * @throw 404 일치하는 대상을 찾지 못했습니다.
   */
  @Get(':user_id')
  findOne(@TypedParam('user_id', 'uuid') id: string): Promise<IUser.Public> {
    return UsersUsecase.findOne(id);
  }
}
