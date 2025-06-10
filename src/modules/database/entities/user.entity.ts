import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ServiceProvider } from './service-provider.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @Column({ unique: true }) email: string;

  @Column({ name: 'password_hash' }) passwordHash: string;

  @Column({ type: 'enum', enum: ["admin",'prestador'], name: 'user_type' })
  userType: "admin"|'prestador';

  @Column({ name: 'invite_token', nullable: true }) inviteToken?: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => ServiceProvider, (provider) => provider.user)
  serviceProvider?: ServiceProvider;
}
