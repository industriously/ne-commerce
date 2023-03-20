/**
 * @packageDocumentation
 * @module api.functional.sign_in.google
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";
import typia from "typia";

import type { IAuthUsecase } from "./../../../interface/user/auth.usecase.interface";

/**
 * 로그인 테스트용 api
 * 
 * @controller AuthController.signInTestCb()
 * @path GET /sign-in/google
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function signInTestCb
    (
        connection: IConnection,
        code: string
    ): Promise<signInTestCb.Output>
{
    return Fetcher.fetch
    (
        connection,
        signInTestCb.ENCRYPTED,
        signInTestCb.METHOD,
        signInTestCb.path(code)
    );
}
export namespace signInTestCb
{
    export type Output = string;

    export const METHOD = "GET" as const;
    export const PATH: string = "/sign-in/google";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(code: string): string
    {
        return `/sign-in/google?${new URLSearchParams(
        {
            code
        } as any).toString()}`;
    }
}

/**
 * 로그인 API
 * 
 * 새로운 사용자가 로그인을 진행하면 google oauth 서버에서 제공한 사용자 정보를 토대로
 * 사용자 계정을 생성합니다.
 * 
 * 비활성화된 사용자의 경우, 다시 활성화됩니다.
 * 
 * @tag authentication
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param body token 요청 권한을 가진 code를 포함한다.
 * @returns access_token, refresh_token, id_token을 포함한 객체를 응답
 * @throw 401 사용자 인증에 실패했습니다.
 * 
 * @controller AuthController.signInGoogle()
 * @path POST /sign-in/google
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function signInGoogle
    (
        connection: IConnection,
        body: IAuthUsecase.SignInBody
    ): Promise<signInGoogle.Output>
{
    return Fetcher.fetch
    (
        connection,
        signInGoogle.ENCRYPTED,
        signInGoogle.METHOD,
        signInGoogle.path(),
        body,
        signInGoogle.stringify
    );
}
export namespace signInGoogle
{
    export type Input = IAuthUsecase.SignInBody;
    export type Output = IAuthUsecase.SignInResponse;

    export const METHOD = "POST" as const;
    export const PATH: string = "/sign-in/google";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/sign-in/google`;
    }
    export const stringify = (input: Input) => typia.assertStringify(input);
}