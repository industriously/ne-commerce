import { IFailure, Try, TryCatch } from '@INTERFACE/common';

interface ifSuccess {
  <T, R>(iter: (input: T) => Try<R> | Promise<Try<R>>): <E extends IFailure>(
    input: TryCatch<T, E>,
  ) => TryCatch<R, E> | Promise<TryCatch<R, E>>;

  <T, R, E1 extends IFailure>(
    iter: (input: T) => TryCatch<R, E1> | Promise<TryCatch<R, E1>>,
  ): <E2 extends IFailure>(
    input: TryCatch<T, E2>,
  ) => TryCatch<R, E1 | E2> | Promise<TryCatch<R, E1 | E2>>;
}

export const ifSuccess: ifSuccess =
  <T, R, E1 extends IFailure>(
    iter: (
      input: T,
    ) => Try<R> | Promise<Try<R>> | TryCatch<R, E1> | Promise<TryCatch<R, E1>>,
  ) =>
  <E2 extends IFailure>(input: TryCatch<T, E2>) =>
    input.type === 'success' ? iter(input.data) : input;
