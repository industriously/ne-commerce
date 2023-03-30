import { Try } from '@INTERFACE/common';

export const getTry = <T>(data: T): Try<T> => ({ type: 'success', data });
