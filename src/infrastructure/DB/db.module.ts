import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from './transaction.interceptor';

@Global()
@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: TransactionInterceptor }],
})
export class DBModule {}
