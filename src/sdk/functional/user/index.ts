/**
 * @packageDocumentation
 * @module api.functional.user
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";
import typia from "typia";

import type { UserSchema } from "./../../interface/user/user.schema.interface";
import type { IUserUsecase } from "./../../interface/user/user.usecase.interface";

/**
 * 내 프로필 보기 API
 * 
 * @tag user
 * @returns 사용자 상세 정보 응답
 * @throw 400 잘못된 토큰입니다.
 * @throw 404 일치하는 대상을 찾지 못했습니다.
 * 
 * @controller UserController.getProfile()
 * @path GET /user
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function getProfile
    (
        connection: IConnection
    ): Promise<getProfile.Output>
{
    return Fetcher.fetch
    (
        connection,
        getProfile.ENCRYPTED,
        getProfile.METHOD,
        getProfile.path()
    );
}
export namespace getProfile
{
    export type Output = UserSchema.Detail;

    export const METHOD = "GET" as const;
    export const PATH: string = "/user";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/user`;
    }
}

/**
 * 내 정보 수정 API
 * 
 * @tag user
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param body 수정할 정보를 포함합니다.
 * @throw 400 잘못된 토큰입니다.
 * 
 * @controller UserController.updateProfile()
 * @path PATCH /user
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function updateProfile
    (
        connection: IConnection,
        body: IUserUsecase.UpdateData
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        updateProfile.ENCRYPTED,
        updateProfile.METHOD,
        updateProfile.path(),
        body,
        updateProfile.stringify
    );
}
export namespace updateProfile
{
    export type Input = IUserUsecase.UpdateData;

    export const METHOD = "PATCH" as const;
    export const PATH: string = "/user";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/user`;
    }
    export const stringify = (input: Input) => typia.assertStringify(input);
}

/**
 * 내 계정 비활성화 API
 * 
 * 사용자는 로그인을 통해 계정을 활성화할 수 있습니다.
 * 
 * 비활성화된 계정은 조회되지 않습니다.
 * 
 * @tag user
 * @throw 400 잘못된 토큰입니다.
 * 
 * @controller UserController.inActivate()
 * @path DELETE /user
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function inActivate
    (
        connection: IConnection
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        inActivate.ENCRYPTED,
        inActivate.METHOD,
        inActivate.path()
    );
}
export namespace inActivate
{

    export const METHOD = "DELETE" as const;
    export const PATH: string = "/user";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/user`;
    }
}