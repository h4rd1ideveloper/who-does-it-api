import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Review } from './review.entity';
import { ContactClick } from './contact-click.entity';
import { ServiceProviderVisit } from './service-provider-visit.entity';

@Entity({ name: 'service_providers' })
export class ServiceProvider {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'cpf_cnpj', nullable: true }) cpfCnpj?: string;

  @Column() phone: string;

  @Column() address: string;

  @Column() city: string;

  @Column() state: string;

  @Column() zipCode: string;

  @Column({ name: 'home_service', default: false }) homeService: boolean;

  @Column({ name: 'business_hours', nullable: true }) businessHours?: string;

  @Column({ name: 'photo_url', nullable: true }) photoUrl?: string;

  @Column({ name: 'is_active', default: true }) isActive: boolean;

  @Column({
    name: 'registered_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registeredAt: Date;

  @OneToOne(() => User, (user) => user.serviceProvider)
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => Service, (service) => service.provider) services: Service[];

  @OneToMany(() => Review, (review) => review.serviceProvider)
  reviews: Review[];

  @OneToMany(() => ServiceProviderVisit, (visit) => visit.serviceProvider)
  visits: ServiceProviderVisit[];

  @OneToMany(() => ContactClick, (click) => click.serviceProvider)
  contactClicks: ContactClick[];
}
