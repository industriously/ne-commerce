import { getSuccessReturn } from '@COMMON/exception';
import { IException, TryCatch } from '@INTERFACE/common';
import { Prisma } from '@PRISMA';

export const _update =
  <T, E extends IException>(
    update: (input: T) => Promise<Prisma.BatchPayload>,
    NOT_FOUND: E,
  ) =>
  async (input: T): Promise<TryCatch<T, E>> => {
    const { count } = await update(input);
    if (count < 1) return NOT_FOUND;
    return getSuccessReturn(input);
  };
