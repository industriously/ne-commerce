import { Prisma } from '@PRISMA';
import { tryCatch } from '@UTIL';

export const _update = <T, W, U>(
  whereMapper: (input: T) => W,
  dataMapper: (input: T) => U,
  update: (where: W, data: U) => Promise<Prisma.BatchPayload>,
) =>
  tryCatch(async (input: T) => {
    const { count } = await update(whereMapper(input), dataMapper(input));
    if (count < 1) {
      throw Error('Record not found.');
    }
    return input;
  });
