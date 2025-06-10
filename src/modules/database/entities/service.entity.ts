import { ServiceProvider } from './service-provider.entity';
import { Category } from './category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'service_provider_id' }) serviceProviderId: number;

  @Column({ name: 'category_id' }) categoryId: number;

  @Column() title: string;

  @Column() description: string;

  @Column({ name: 'price_min', type: 'double precision' }) priceMin: number;

  @Column({ name: 'price_max', type: 'double precision', nullable: true })
  priceMax?: number;

  @Column({ name: 'estimated_time' }) estimatedTime: string;

  @Column({
    type: 'enum',
    enum: ['oficina', 'domicilio', 'ambos'],
    name: 'service_location',
  })
  serviceLocation: 'oficina'| 'domicilio'| 'ambos';

  @Column({ name: 'photo_urls', type: 'text', nullable: true })
  photoUrls?: string;

  @ManyToOne(() => ServiceProvider, (provider) => provider.services)
  @JoinColumn({ name: 'service_provider_id' })
  provider: ServiceProvider;

  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
