/** 
import { Prisma } from '@PRISMA';
import { ProviderBuilder } from '@UTIL';
import { getNamespace } from 'cls-hooked';
import { prisma } from './prisma.service';
import { TRANSACTION_CLIENT, TRANSACTION_NS_KEY } from './transaction';

export const ClientFactory = async (): Promise<DBClient> => {
  return ProviderBuilder<DBClient>({
    get() {
      const namespace = getNamespace(TRANSACTION_NS_KEY);
      if (!namespace?.active) {
        throw Error('Namespace is not active');
      }

      return namespace.get(TRANSACTION_CLIENT) ?? prisma;
    },
  }).build();
};

export interface DBClient {
  readonly get: () => Prisma.TransactionClient;
}
*/
