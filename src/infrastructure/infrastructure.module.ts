import { Module } from '@nestjs/common';
import { DBModule } from './DB/db.module';
import { LoggerModule } from './logger/logger.module';
import { FilterModule } from './filter/filter.module';

@Module({
  imports: [LoggerModule, DBModule, FilterModule],
})
export class InfrastructureModule {}
