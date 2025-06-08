import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProvider } from './service-provider.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'service_provider_id' }) serviceProviderId: number;

  @Column({ name: 'client_name' }) clientName: string;

  @Column({ name: 'rating' }) rating: number;

  @Column({ name: 'comment', nullable: true }) comment?: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => ServiceProvider, (provider) => provider.reviews)
  @JoinColumn({ name: 'service_provider_id' })
  serviceProvider: ServiceProvider;
}
