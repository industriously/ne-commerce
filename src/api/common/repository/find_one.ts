import { tryCatch } from '@UTIL';

export const _findOne = <T, W, M, R>(
  whereMapper: (input: T) => W,
  findOrThrow: (where: W) => Promise<M>,
  mapper: (input: M) => R,
) =>
  tryCatch(async (input: T) => {
    const where = whereMapper(input);
    const model = await findOrThrow(where);
    return mapper(model);
  });
