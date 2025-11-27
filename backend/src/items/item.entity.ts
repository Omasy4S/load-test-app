import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  @Index() // Индекс для оптимизации поиска
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  @Index() // Индекс для оптимизации сортировки по дате
  createdAt: Date;
}
