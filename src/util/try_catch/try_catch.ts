import { getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';

export const tryCatch =
  <T, R, F extends IFailure>(
    done: (input: T) => R,
    exception: F,
    throwThen?: (err: any) => void | Promise<void>,
  ) =>
  async (input: T): Promise<TryCatch<Awaited<R>, F>> => {
    try {
      return getTry(await done(input));
    } catch (error) {
      if (throwThen) await throwThen(error);
      return exception;
    }
  };
