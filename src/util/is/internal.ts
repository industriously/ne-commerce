import { IFailure, ISuccess } from '@INTERFACE/common';

export const isInternal = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Internal => input.type === 'internal';
