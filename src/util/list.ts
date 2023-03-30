export namespace List {
  export const map =
    <T, R>(iter: (_: T) => R) =>
    (input: T[]) => {
      return input.map(iter);
    };

  export const each =
    <T>(iter: (input: T) => void) =>
    (input: T[]) =>
      input.forEach(iter);

  export const filter =
    <T>(predicate: (input: T) => boolean) =>
    (input: T[]) =>
      input.filter(predicate);

  export const isEmpty = <T>(list: T[]): boolean => list.length === 0;

  export const throwIfEmpty =
    (err: unknown) =>
    <T>(list: T[]): T[] => {
      if (isEmpty(list)) {
        throw err;
      }
      return list;
    };
}
