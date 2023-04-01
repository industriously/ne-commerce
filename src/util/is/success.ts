import { IFailure, Try, TryCatch } from '@INTERFACE/common';

export const is_success = <T, E extends IFailure>(
  input: TryCatch<T, E>,
): input is Try<T> => input.type === 'success';
