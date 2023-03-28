/**
 * @packageDocumentation
 * @module api.functional.token.refresh
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";

import type { IAuthentication } from "./../../../interface/user/auth.interface";

/**
 * Authorization header로 refresh_token을 전달헤야 합니다.
 * 
 * @summary 인증 토큰 재발행 API
 * @tag authentication
 * @returns 재발행된 access_token을 응답합니다.
 * @throw 400 잘못된 토큰입니다.
 * @throw 404 일치하는 대상을 찾지 못했습니다.
 * 
 * @controller AuthController.refreshToken()
 * @path GET /token/refresh
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function refreshToken
    (
        connection: IConnection
    ): Promise<refreshToken.Output>
{
    return Fetcher.fetch
    (
        connection,
        refreshToken.ENCRYPTED,
        refreshToken.METHOD,
        refreshToken.path()
    );
}
export namespace refreshToken
{
    export type Output = IAuthentication.RefreshedCredential;

    export const METHOD = "GET" as const;
    export const PATH: string = "/token/refresh";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/token/refresh`;
    }
}