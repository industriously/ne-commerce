import { Try } from '@INTERFACE/common';

export const getSuccessReturn = <T>(data: T) =>
  ({
    code: '1000',
    data,
  } as const satisfies Try<T>);
