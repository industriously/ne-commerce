import { IFailure, ISuccess } from '@INTERFACE/common';

export const isInternal = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Internal => input.type === 'internal';

export const isInternalFail = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Internal.Fail =>
  isInternal(input) && input.event === 'Fail';

export const isInternalInvalid = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Internal.Invalid =>
  isInternal(input) && input.event === 'Invalid';
