import { IEntity } from './entity.interface';

export interface IRepository<Aggregate extends IEntity<IId>, IId = unknown> {
  readonly findOne: (id: IId) => Promise<Aggregate | null>;
  readonly save: (aggregate: Aggregate) => Promise<Aggregate>;
  readonly remove: (id: IId) => Promise<void>;
}
