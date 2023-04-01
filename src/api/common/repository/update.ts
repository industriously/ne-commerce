import { getTry } from '@COMMON/exception';
import { IFailure, TryCatch } from '@INTERFACE/common';
import { Prisma } from '@PRISMA';

export const _update =
  <T>(
    update: (input: T) => Promise<Prisma.BatchPayload>,
    NOT_FOUND: IFailure.Business.NotFound,
  ) =>
  async (input: T): Promise<TryCatch<T, IFailure.Business.NotFound>> => {
    const { count } = await update(input);
    if (count < 1) return NOT_FOUND;
    return getTry(input);
  };
