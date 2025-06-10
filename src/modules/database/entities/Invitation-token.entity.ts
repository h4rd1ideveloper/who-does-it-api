import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'invitation_tokens' })
export class InvitationToken {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true }) token: string;

  @Column({ name: 'expires_at', type: 'date' }) expiresAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' }) createdAt: Date;
}
