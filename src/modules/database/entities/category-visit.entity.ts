import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ name: 'category_visits' })
export class CategoryVisit {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'category_id' }) categoryId: number;

  @Column({
    name: 'visited_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  visitedAt: Date;

  @ManyToOne(() => Category, (category) => category.visits)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
