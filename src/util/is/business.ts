import { IFailure, ISuccess } from '@INTERFACE/common';

export const isBusiness = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Business => input.type === 'business';
