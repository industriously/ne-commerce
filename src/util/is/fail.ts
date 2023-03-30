import { TryCatch, IFailure } from '@INTERFACE/common';

export const isFail = <T, E extends IFailure>(
  input: TryCatch<T, E>,
): input is E => input.type !== 'success';
