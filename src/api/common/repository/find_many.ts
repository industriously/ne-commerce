import { Failure, getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import {
  pipeAsync,
  is_success,
  List,
  ifSuccess,
  tryCatch,
  flatten,
} from '@UTIL';
import { pipe } from 'rxjs';

export const _findMany = <T, M, A>(
  validator: (input: T) => input is T,
  findMany: (input: T) => Promise<M[]>,
  mapper: (input: M) => TryCatch<A, IFailure.Internal.Invalid>,
) =>
  pipeAsync(
    (input: T) =>
      validator(input) ? getTry(input) : Failure.Internal.InvalidValue,

    ifSuccess(tryCatch(findMany, Failure.Internal.FailDB)),

    ifSuccess(
      pipe(
        List.map(mapper),

        (result) => result.filter(is_success),

        List.map(flatten),

        getTry,
      ),
    ),
  );
