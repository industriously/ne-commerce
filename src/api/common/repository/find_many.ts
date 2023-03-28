import { tryCatch } from '@UTIL';

export const _findMany = <T, A, M, R>(
  ArgMapper: (input: T) => A,
  findMany: (args: A) => Promise<M[]>,
  mapper: (input: M) => R,
) =>
  tryCatch(async (input: T) => {
    const list = await findMany(ArgMapper(input));
    return list.map(mapper);
  });
