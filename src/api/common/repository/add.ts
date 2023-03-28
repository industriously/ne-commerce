export const _add =
  <T, D, M>(
    dataMapper: (input: T) => D,
    create: (input: D) => Promise<M>,
    mapper: (input: M) => T,
  ) =>
  async (input: T) => {
    const model = await create(dataMapper(input));
    return mapper(model);
  };
