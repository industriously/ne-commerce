import { Exception, getSuccessReturn } from '@COMMON/exception';
import { TryCatch } from '@INTERFACE/common';
import { pipeAsync, is_success, List } from '@UTIL';

export const _findMany = <T, M, A>(
  validator: (input: T) => input is T,
  findMany: (input: T) => Promise<M[]>,
  mapper: (input: M) => TryCatch<A, typeof Exception.INVALID_VALUE>,
) =>
  pipeAsync(
    (input: T) =>
      validator(input) ? getSuccessReturn(input) : Exception.INVALID_VALUE,

    async (result) =>
      result.code === '1000'
        ? getSuccessReturn(await findMany(result.data))
        : result,

    (result) => (result.code === '4000' ? [] : result.data),

    List.map(mapper),

    (result) => result.filter(is_success),

    List.map((result) => result.data),

    getSuccessReturn<A[]>,
  );
