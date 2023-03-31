import { IFailure, ISuccess } from '@INTERFACE/common';

export const isBusiness = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Business => input.type === 'business';

export const isBusinessNotFound = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Business.NotFound =>
  isBusiness(input) && input.event === 'NotFound';

export const isBusinessForbidden = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Business.Forbidden =>
  isBusiness(input) && input.event === 'Forbidden';

export const isBusinessInvalid = <T>(
  input: ISuccess<T> | IFailure,
): input is IFailure.Business.Invalid =>
  isBusiness(input) && input.event === 'Invalid';
