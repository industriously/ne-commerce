import { IException, Try, TryCatch } from '@INTERFACE/common';

interface ifSuccess {
  <T, R>(iter: (input: T) => Try<R> | Promise<Try<R>>): <E extends IException>(
    input: TryCatch<T, E>,
  ) => TryCatch<R, E> | Promise<TryCatch<R, E>>;

  <T, R, E1 extends IException>(
    iter: (input: T) => TryCatch<R, E1> | Promise<TryCatch<R, E1>>,
  ): <E2 extends IException>(
    input: TryCatch<T, E2>,
  ) => TryCatch<R, E1 | E2> | Promise<TryCatch<R, E1 | E2>>;
}

export const ifSuccess: ifSuccess =
  <T, R, E1 extends IException>(
    iter: (
      input: T,
    ) => Try<R> | Promise<Try<R>> | TryCatch<R, E1> | Promise<TryCatch<R, E1>>,
  ) =>
  <E2 extends IException>(input: TryCatch<T, E2>) =>
    input.code === '1000' ? iter(input.data) : input;
