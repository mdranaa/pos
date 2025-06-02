import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ProductsModule } from '../products/products.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [ProductsModule, EventsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}