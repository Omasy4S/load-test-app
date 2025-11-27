import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  // Простой in-memory кэш для оптимизации
  private cache = new Map<string, { data: Item[]; timestamp: number }>();
  private readonly CACHE_TTL = 5000; // 5 секунд

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async findAll(limit: number = 10, offset: number = 0): Promise<Item[]> {
    const cacheKey = `items_${limit}_${offset}`;
    const cached = this.cache.get(cacheKey);
    
    // Проверяем кэш
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Оптимизированный запрос с использованием индексов
    const items = await this.itemsRepository
      .createQueryBuilder('item')
      .select(['item.id', 'item.name', 'item.createdAt'])
      .orderBy('item.id', 'ASC')
      .skip(offset)
      .take(limit)
      .getMany();

    // Сохраняем в кэш
    this.cache.set(cacheKey, { data: items, timestamp: Date.now() });
    
    // Очищаем старые записи кэша
    if (this.cache.size > 1000) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    return items;
  }

  async count(): Promise<number> {
    return this.itemsRepository.count();
  }

  // Метод для seed данных
  async seed(count: number = 50000): Promise<void> {
    const existingCount = await this.count();
    if (existingCount >= count) {
      console.log(`Already have ${existingCount} items, skipping seed`);
      return;
    }

    const batchSize = 1000;
    const batches = Math.ceil(count / batchSize);

    console.log(`Seeding ${count} items in ${batches} batches...`);

    for (let i = 0; i < batches; i++) {
      const items: Partial<Item>[] = [];
      for (let j = 0; j < batchSize && (i * batchSize + j) < count; j++) {
        items.push({
          name: `Item ${i * batchSize + j + 1} - ${this.generateRandomString(10)}`,
        });
      }
      
      await this.itemsRepository
        .createQueryBuilder()
        .insert()
        .into(Item)
        .values(items)
        .execute();

      if ((i + 1) % 10 === 0) {
        console.log(`Seeded ${(i + 1) * batchSize} items...`);
      }
    }

    console.log(`Seeding complete! Total items: ${await this.count()}`);
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
