import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TokenModule } from '@TOKEN';
import { ProductsController } from './presentation';
import { providers } from './providers';

@Module({
  imports: [CqrsModule, TokenModule],
  controllers: [ProductsController],
  providers,
})
export class ProductModule {}
