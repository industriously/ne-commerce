import { Failure, getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { isNull, pipeAsync, ifSuccess, tryCatch } from '@UTIL';

export const _findOne = <T, M, A>(
  validator: (input: T) => input is T,
  findOne: (input: T) => Promise<M | null>,
  mapper: (input: M) => TryCatch<A, IFailure.Internal.Invalid>,
  NOT_FOUND: IFailure.Business.NotFound,
) =>
  pipeAsync(
    (input: T) =>
      validator(input) ? getTry(input) : Failure.Internal.InvalidValue,

    ifSuccess(tryCatch(findOne, Failure.Internal.FailDB)),

    ifSuccess((data: M | null) => (isNull(data) ? NOT_FOUND : mapper(data))),
  );
