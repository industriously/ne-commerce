import { getTry } from '@COMMON/exception';
import { IFailure, Try, TryCatch } from '@INTERFACE/common';
import { is_success, flatten } from '@UTIL';

export const _findMany =
  <T, M, A>(
    findMany: (input: T) => Promise<M[]>,
    mapper: (input: M) => TryCatch<A, IFailure.Internal.Invalid>,
  ) =>
  async (input: T): Promise<Try<A[]>> => {
    const model = await findMany(input);

    const data = model.map(mapper).filter(is_success).map(flatten);
    return getTry(data);
  };
