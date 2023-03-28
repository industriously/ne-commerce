/**
 * @packageDocumentation
 * @module api.functional.sign_in
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";
import typia from "typia";

import type { IAuthentication } from "./../../interface/user/auth.interface";
import type { TryCatch } from "./../../interface/common/function.interface";
import type { __object } from "./../../../api/common/exception/exception";

export * as google from "./google";

/**
 * 로그인 테스트용 api
 * 
 * @controller AuthController.signInTest()
 * @path GET /sign-in
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function signInTest
    (
        connection: IConnection
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        signInTest.ENCRYPTED,
        signInTest.METHOD,
        signInTest.path()
    );
}
export namespace signInTest
{

    export const METHOD = "GET" as const;
    export const PATH: string = "/sign-in";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/sign-in`;
    }
}

/**
 * 새로운 사용자가 로그인을 진행하면 oauth 서버에서 제공한 사용자 정보를 토대로
 * 사용자 계정을 생성합니다.
 * 
 * 비활성화된 사용자의 경우, 다시 활성화됩니다.
 * 
 * @summary 로그인 API
 * @tag authentication
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param body token 요청 권한을 가진 code를 포함한다.
 * @returns success Credentials
 * @throw "login fail"
 * @throw 4000
 * 
 * @controller AuthController.signIn()
 * @path POST /sign-in
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function signIn
    (
        connection: IConnection,
        body: IAuthentication.SignInBody
    ): Promise<signIn.Output>
{
    return Fetcher.fetch
    (
        connection,
        signIn.ENCRYPTED,
        signIn.METHOD,
        signIn.path(),
        body,
        signIn.stringify
    );
}
export namespace signIn
{
    export type Input = IAuthentication.SignInBody;
    export type Output = TryCatch<IAuthentication.Credentials, __object>;

    export const METHOD = "POST" as const;
    export const PATH: string = "/sign-in";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/sign-in`;
    }
    export const stringify = (input: Input) => typia.assertStringify(input);
}