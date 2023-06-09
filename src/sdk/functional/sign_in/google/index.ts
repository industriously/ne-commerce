/**
 * @packageDocumentation
 * @module api.functional.sign_in.google
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";

/**
 * 로그인 테스트용 api
 * 
 * @internal
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
        const variables: Record<any, any> = 
        {
            code
        } as any;
        for (const [key, value] of Object.entries(variables))
            if (value === undefined) delete variables[key];
        const encoded: string = new URLSearchParams(variables).toString();
        return `/sign-in/google${encoded.length ? `?${encoded}` : ""}`;;
    }
}