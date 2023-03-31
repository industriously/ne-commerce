import { Authorization } from '@COMMON/decorator/http';
import { Failure } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
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
   */
  @Get()
  getDetail(
    @Authorization('bearer') token: string,
  ): Promise<TryCatch<IUser.Detail, IFailure.Business.Invalid>> {
    return UserUsecase.findOne(token);
  }

  /**
   * @summary 내 정보 수정 API
   * @tag user
   * @param body 수정할 정보를 포함합니다.
   * @returns 수정된 상세 정보
   */
  @Patch()
  async update(
    @Authorization('bearer') token: string,
    @Body() body: IUser.UpdateInput,
  ): Promise<TryCatch<IUser.Detail, IFailure.Business.Invalid>> {
    if (!typia.isPrune(body)) return Failure.Business.InvalidBody;
    return UserUsecase.update(token, body);
  }

  /**
   * 사용자는 로그인을 통해 계정을 활성화할 수 있습니다.
   *
   * 비활성화된 계정은 조회되지 않습니다.
   *
   * @summary 내 계정 비활성화 API
   * @tag user
   * @returns true
   */
  @Delete()
  inActivate(
    @Authorization('bearer') token: string,
  ): Promise<TryCatch<true, IFailure.Business.Invalid>> {
    return UserUsecase.inActivate(token);
  }
}
