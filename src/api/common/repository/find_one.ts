import { Exception, getSuccessReturn } from '@COMMON/exception';
import { IException, TryCatch } from '@INTERFACE/common';
import { isNull, pipeAsync } from '@UTIL';

export const _findOne = <T, M, A, E extends IException>(
  validator: (input: T) => input is T,
  findOne: (input: T) => Promise<M | null>,
  mapper: (input: M) => TryCatch<A, typeof Exception.INVALID_VALUE>,
  NOT_FOUND: E,
) =>
  pipeAsync(
    (input: T) =>
      validator(input) ? getSuccessReturn(input) : Exception.INVALID_VALUE,

    async (result) =>
      result.code === '1000'
        ? getSuccessReturn(await findOne(result.data))
        : result,

    (result) =>
      result.code === '1000'
        ? isNull(result.data)
          ? NOT_FOUND
          : mapper(result.data)
        : result,

    (result) => (result.code === '4000' ? NOT_FOUND : result),
  );
