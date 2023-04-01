import { Try } from '@INTERFACE/common';

export const flatten = <T>(input: Try<T>) => input.data;
