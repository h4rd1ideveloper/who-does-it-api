import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';
import { CategoryVisit } from './category-visit.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true }) name: string;

  @Column({ unique: true }) slug: string;

  @Column({ name: 'image_url', nullable: true }) imageUrl?: string;

  @OneToMany(() => Service, (service) => service.category) services: Service[];

  @OneToMany(() => CategoryVisit, (visit) => visit.category)
  visits: CategoryVisit[];
}
