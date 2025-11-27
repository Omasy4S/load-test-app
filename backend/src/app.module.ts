import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { Item } from './items/item.entity';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'loadtest',
      entities: [Item],
      synchronize: true, // В продакшене лучше использовать миграции
      // Оптимизация: connection pool
      extra: {
        max: 20, // максимум соединений в пуле
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    }),
    ItemsModule,
  ],
})
export class AppModule {}
