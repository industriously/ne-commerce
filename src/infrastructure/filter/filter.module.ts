import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './all-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class FilterModule {}
