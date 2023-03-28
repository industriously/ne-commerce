import { IException, TryCatch } from '@INTERFACE/common';

export const ifSuccess =
  <T, R, E1 extends IException>(
    iter: (input: T) => TryCatch<R, E1> | Promise<TryCatch<R, E1>>,
  ) =>
  <E2 extends IException>(
    input: TryCatch<T, E2>,
  ): TryCatch<R, E1 | E2> | Promise<TryCatch<R, E1 | E2>> =>
    input.code === '1000' ? iter(input.data) : input;
