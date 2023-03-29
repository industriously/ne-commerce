import { Module } from '@nestjs/common';
import { ProductModule } from '@PRODUCT/product.module';

@Module({
  imports: [ProductModule],
})
export class ApiModule {}
