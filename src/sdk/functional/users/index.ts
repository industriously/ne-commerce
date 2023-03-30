/**
 * @packageDocumentation
 * @module api.functional.users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";

import type { TryCatch } from "./../../interface/common/exception.interface";
import type { IUser } from "./../../interface/user/user.interface";

/**
 * 활성화된 사용자의 정보만 조회합니다.
 * 
 * @summary 사용자 프로필 조회 API
 * @tag users
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param user_id 조회 대상의 id 입니다.
 * @returns 사용자 공개 정보
 * 
 * @controller UsersController.findOne()
 * @path GET /users/:user_id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function findOne
    (
        connection: IConnection,
        id: string
    ): Promise<findOne.Output>
{
    return Fetcher.fetch
    (
        connection,
        findOne.ENCRYPTED,
        findOne.METHOD,
        findOne.path(id)
    );
}
export namespace findOne
{
    export type Output = TryCatch<IUser.Public, Invalid | Fail | NotFound>;

    export const METHOD = "GET" as const;
    export const PATH: string = "/users/:user_id";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(id: string): string
    {
        return `/users/${encodeURIComponent(id)}`;
    }
}