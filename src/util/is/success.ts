import { IException, Try, TryCatch } from '@INTERFACE/common';

export const is_success = <T, E extends IException>(
  input: TryCatch<T, E>,
): input is Try<T> => input.code === '1000';
