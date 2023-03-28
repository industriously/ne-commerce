import { FunctionType, TryCatch } from '@INTERFACE/common';

export const tryCatch =
  <T extends FunctionType>(fn: T) =>
  async (...args: Parameters<T>): Promise<TryCatch<Awaited<ReturnType<T>>>> => {
    try {
      const result = await fn(...args);
      return { is_success: true, result, message: undefined };
    } catch (error) {
      return {
        is_success: false,
        result: undefined,
        message: (error as Error).message,
      };
    }
  };
