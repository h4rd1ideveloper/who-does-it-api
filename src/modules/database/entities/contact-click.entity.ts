import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProvider } from './service-provider.entity';


@Entity({ name: 'contact_clicks' })
export class ContactClick {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'service_provider_id' }) serviceProviderId: number;

  @Column({
    type: 'enum',
    enum: ['whatsapp', 'email', 'telefone'],
    name: 'contact_type',
  })
  contactType: 'whatsapp' | 'email' | 'telefone';

  @Column({
    name: 'clicked_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  clickedAt: Date;

  @ManyToOne(() => ServiceProvider, (provider) => provider.contactClicks)
  @JoinColumn({ name: 'service_provider_id' })
  serviceProvider: ServiceProvider;
}
