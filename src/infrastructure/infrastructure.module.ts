import { Module } from '@nestjs/common';
import { PrismaModule } from './DB/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { FilterModule } from './filter/filter.module';
import { AopModule } from '@toss/nestjs-aop';

@Module({
  imports: [LoggerModule, PrismaModule, FilterModule, AopModule],
})
export class InfrastructureModule {}
