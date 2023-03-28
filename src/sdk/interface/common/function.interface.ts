export type FunctionType = (...args: any[]) => any;

export interface IException {
  readonly code: ExceptionCode;
  readonly data: string;
}

export interface Try<T> {
  readonly code: '1000';
  readonly data: T;
}

export type TryCatch<T, E extends IException | null> = Try<T> | E;

export type ExceptionCode =
  | '4000'
  | '4001'
  | '4002'
  | '4003'
  | '4004'
  | '4005'
  | '4006'
  | '4007'
  | '4008'
  | '4009'
  | '4010'
  | '5000';
