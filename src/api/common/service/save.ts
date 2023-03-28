import { HttpExceptionFactory } from '@COMMON/exception';
import { TryCatch } from '@INTERFACE/common';

export const _save =
  <T>(execute: (input: T) => Promise<TryCatch<T>>) =>
  async (input: T) => {
    const { is_success, result } = await execute(input);
    if (!is_success) {
      throw HttpExceptionFactory('NotFound');
    }
    return result;
  };
