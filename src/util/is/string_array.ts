import { isString } from './string';

export const isStringArray = (input: string[]): input is string[] =>
  Array.isArray(input) && input.every(isString);
