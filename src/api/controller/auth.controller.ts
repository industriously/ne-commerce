import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GithubGuard, GoogleGuard, OauthProfile } from '@USER/_auth_';
import { Authorization, TypedQuery } from '@COMMON/decorator/http';
import { TypedBody } from '@nestia/core';
import typia from 'typia';
import { IAuthentication } from '@INTERFACE/user';
import { AuthenticationUsecase } from '@USER/usecase';

@Controller()
export class AuthController {
  /**
   * 로그인 테스트용 api
   *
   * @internal
   */
  @UseGuards(GoogleGuard)
  @Get('sign-in')
  signInTest() {}

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
   * 새로운 사용자가 로그인을 진행하면 google oauth 서버에서 제공한 사용자 정보를 토대로
   * 사용자 계정을 생성합니다.
   *
   * 비활성화된 사용자의 경우, 다시 활성화됩니다.
   *
   * @summary 로그인 API
   * @tag authentication
   * @param body token 요청 권한을 가진 code를 포함한다.
   * @returns access_token, refresh_token, id_token을 포함한 객체를 응답
   * @throw 401 사용자 인증에 실패했습니다.
   */
  @UseGuards(GoogleGuard)
  @Post('sign-in/google')
  signInGoogle(
    @TypedBody() body: IAuthentication.SignInBody,
    @OauthProfile() profile: IAuthentication.OauthProfile,
  ): Promise<IAuthentication.Credentials> {
    return AuthenticationUsecase.signIn(profile);
  }

  /**
   * 새로운 사용자가 로그인을 진행하면 github oauth 서버에서 제공한 사용자 정보를 토대로
   * 사용자 계정을 생성합니다.
   *
   * 비활성화된 사용자의 경우, 다시 활성화됩니다.
   *
   * @summary 로그인 API
   * @tag authentication
   * @param body token 요청 권한을 가진 code를 포함한다.
   * @returns access_token, refresh_token, id_token을 포함한 객체를 응답
   * @throw 401 사용자 인증에 실패했습니다.
   */
  @UseGuards(GithubGuard)
  @Post('sign-in/github')
  signInGithub(
    @TypedBody() body: IAuthentication.SignInBody,
    @OauthProfile() profile: IAuthentication.OauthProfile,
  ): Promise<IAuthentication.Credentials> {
    return AuthenticationUsecase.signIn(profile);
  }

  /**
   * Authorization header로 refresh_token을 전달헤야 합니다.
   *
   * @summary 인증 토큰 재발행 API
   * @tag authentication
   * @returns 재발행된 access_token을 응답합니다.
   * @throw 400 잘못된 토큰입니다.
   * @throw 404 일치하는 대상을 찾지 못했습니다.
   */
  @Get('token/refresh')
  refreshToken(
    @Authorization('bearer') token: string,
  ): Promise<IAuthentication.RefreshedCredential> {
    return AuthenticationUsecase.refresh(token);
  }
}
