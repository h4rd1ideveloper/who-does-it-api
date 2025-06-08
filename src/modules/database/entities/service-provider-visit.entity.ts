import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProvider } from './service-provider.entity';

@Entity({ name: 'provider_visits' })
export class ServiceProviderVisit {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'service_provider_id' }) serviceProviderId: number;

  @Column({
    name: 'visited_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  visitedAt: Date;

  @Column({ type: 'enum', enum: VisitOrigin, name: 'visit_origin' })
  visitOrigin: VisitOrigin;

  @ManyToOne(() => ServiceProvider, (provider) => provider.visits)
  @JoinColumn({ name: 'service_provider_id' })
  serviceProvider: ServiceProvider;
}
