import { Module } from '@nestjs/common';
import { ProductsController } from './presentation';
import { providers } from './providers';

@Module({
  controllers: [ProductsController],
  providers,
})
export class ProductModule {}
