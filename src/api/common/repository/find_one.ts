import { IFailure, TryCatch } from '@INTERFACE/common';
import { isNull } from '@UTIL';

export const _findOne =
  <T, M, A>(
    findOne: (input: T) => Promise<M | null>,
    mapper: (input: M) => TryCatch<A, IFailure.Internal.Invalid>,
    NOT_FOUND: IFailure.Business.NotFound,
  ) =>
  async (
    input: T,
  ): Promise<
    TryCatch<A, IFailure.Business.NotFound | IFailure.Internal.Invalid>
  > => {
    const model = await findOne(input);

    return isNull(model) ? NOT_FOUND : mapper(model);
  };
