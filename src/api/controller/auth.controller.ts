import { GoogleStrategy } from '../user/_oauth_/google.strategy';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Authorization, TypedQuery } from '@COMMON/decorator/http';
import typia from 'typia';
import { IAuthentication } from '@INTERFACE/user';
import { TryCatch } from '@INTERFACE/common';
import { Exception } from '@COMMON/exception';
import { AuthenticationUsecase } from '@USER/usecase';

@Controller()
export class AuthController {
  /**
   * 로그인 테스트용 api
   *
   * @internal
   */
  @Get('sign-in')
  signInTest() {
    const google = new GoogleStrategy();
    return google.OAUTH2_URI;
  }

  /**
   * 로그인 테스트용 api
   *
   * @internal
   */
  @Get('sign-in/google')
  signInTestCb(
    @TypedQuery('code', typia.createIs<IAuthentication.SignInBody>())
    code: string,
  ) {
    return code;
  }

  /**
   * 새로운 사용자가 로그인을 진행하면 oauth 서버에서 제공한 사용자 정보를 토대로
   * 사용자 계정을 생성합니다.
   *
   * 비활성화된 사용자의 경우, 다시 활성화됩니다.
   *
   * @summary 로그인 API
   * @tag authentication
   * @param body token 요청 권한을 가진 code를 포함한다.
   * @returns 사용자 인증 토큰
   * @throw 4001 유효하지 않은 body입니다.
   * @throw 4004 로그인에 실패했습니다.
   */
  @Post('sign-in')
  async signIn(
    @Body() body: IAuthentication.SignInBody,
  ): Promise<
    TryCatch<
      IAuthentication.Credentials,
      typeof Exception.LOGIN_FAIL | typeof Exception.INVALID_BODY
    >
  > {
    if (!typia.isPrune(body)) return Exception.INVALID_BODY;
    return AuthenticationUsecase.signIn(body);
  }

  /**
   * Authorization header로 refresh_token을 전달헤야 합니다.
   *
   * @summary 인증 토큰 재발행 API
   * @tag authentication
   * @returns 재발행된 access_token을 응답합니다.
   * @throw 4006 사용자를 찾을 수 없습니다.
   * @throw 4007 잘못된 토큰입니다.
   */
  @Get('token/refresh')
  refreshToken(
    @Authorization('bearer') token: string,
  ): Promise<
    TryCatch<
      string,
      typeof Exception.USER_NOT_FOUND | typeof Exception.INVALID_TOKEN
    >
  > {
    return AuthenticationUsecase.refresh(token);
  }
}
