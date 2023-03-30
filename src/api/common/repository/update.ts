import { Failure, getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { Prisma } from '@PRISMA';

export const _update =
  <T, E extends IFailure.Business.NotFound>(
    update: (input: T) => Promise<Prisma.BatchPayload>,
    NOT_FOUND: E,
  ) =>
  async (input: T): Promise<TryCatch<T, E | IFailure.Internal.Fail>> => {
    try {
      const { count } = await update(input);
      if (count < 1) return NOT_FOUND;
      return getTry(input);
    } catch (error) {
      return Failure.Internal.FailDB;
    }
  };
