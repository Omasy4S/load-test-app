import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule implements OnModuleInit {
  constructor(private readonly itemsService: ItemsService) {}

  // Автоматический seed при запуске приложения
  async onModuleInit() {
    console.log('Checking database and seeding if needed...');
    await this.itemsService.seed(50000);
  }
}
