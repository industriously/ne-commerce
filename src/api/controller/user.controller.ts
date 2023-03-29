import { Authorization } from '@COMMON/decorator/http';
import { Exception } from '@COMMON/exception';
import { TryCatch } from '@INTERFACE/common';
import { IUser } from '@INTERFACE/user';
import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserUsecase } from '@USER/usecase';
import typia from 'typia';

@Controller('user')
export class UserController {
  /**
   * @summary 내 상세 정보 보기 API
   * @tag user
   * @returns 사용자 상세 정보
   * @throw 4006 사용자를 찾을 수 없습니다.
   * @throw 4007 잘못된 토큰입니다.
   */
  @Get()
  getDetail(
    @Authorization('bearer') token: string,
  ): Promise<
    TryCatch<
      IUser.Detail,
      typeof Exception.USER_NOT_FOUND | typeof Exception.INVALID_TOKEN
    >
  > {
    return UserUsecase.findOne(token);
  }

  /**
   * @summary 내 정보 수정 API
   * @tag user
   * @param body 수정할 정보를 포함합니다.
   * @returns 수정된 상세 정보
   * @throw 4001 유효하지 않은 body입니다.
   * @throw 4006 사용자를 찾을 수 없습니다.
   * @throw 4007 잘못된 토큰입니다.
   */
  @Patch()
  async update(
    @Authorization('bearer') token: string,
    @Body() body: IUser.UpdateInput,
  ): Promise<
    TryCatch<
      IUser.Detail,
      | typeof Exception.INVALID_BODY
      | typeof Exception.USER_NOT_FOUND
      | typeof Exception.INVALID_TOKEN
    >
  > {
    if (!typia.isPrune(body)) return Exception.INVALID_BODY;
    return UserUsecase.update(token, body);
  }

  /**
   * 사용자는 로그인을 통해 계정을 활성화할 수 있습니다.
   *
   * 비활성화된 계정은 조회되지 않습니다.
   *
   * @summary 내 계정 비활성화 API
   * @tag user
   * @returns null
   * @throw 4006 사용자를 찾을 수 없습니다.
   * @throw 4007 잘못된 토큰입니다.
   */
  @Delete()
  inActivate(
    @Authorization('bearer') token: string,
  ): Promise<
    TryCatch<
      null,
      typeof Exception.USER_NOT_FOUND | typeof Exception.INVALID_TOKEN
    >
  > {
    return UserUsecase.inActivate(token);
  }
}
