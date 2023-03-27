export type FunctionType = (...args: any[]) => any;

interface Success<T> {
  is_success: true;
  result: T;
  message: undefined;
}

interface Exception {
  is_success: false;
  result: undefined;
  message: string;
}

/**
 * error를 절대 throw하지 않는 함수의 리턴타입
 */
export type TryCatch<T> = Success<T> | Exception;
