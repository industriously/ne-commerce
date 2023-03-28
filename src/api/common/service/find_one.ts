import { HttpExceptionFactory } from '@COMMON/exception';
import { TryCatch } from '@INTERFACE/common';

export const _findOne =
  <T, R>(findOne: (input: T) => Promise<TryCatch<R>>) =>
  async (input: T, message?: string) => {
    const { is_success, result } = await findOne(input);
    if (!is_success) {
      throw HttpExceptionFactory('NotFound', message);
    }
    return result;
  };
