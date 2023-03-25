import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientFactory } from './client.prisma';
import { DBClientToken } from './constants';
import { TransactionDecorator, TransactionInterceptor } from './transaction';

@Global()
@Module({
  providers: [
    TransactionDecorator,
    { provide: APP_INTERCEPTOR, useClass: TransactionInterceptor },
    {
      provide: DBClientToken,
      useFactory: ClientFactory,
    },
  ],
  exports: [DBClientToken],
})
export class PrismaModule {}
