import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { ServiceProvider } from './prestador.entity';

// Usuário (admin e prestadores)
@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() nome: string;

  @Column({ unique: true }) email: string;

  @Column({ name: 'senha_hash' }) senhaHash: string;

  @Column({ type: 'enum', enum: TipoUsuario, name: 'tipo_usuario' })
  tipoUsuario: TipoUsuario;

  @Column({ name: 'token_convite', nullable: true }) tokenConvite?: string;

  @Column({
    name: 'data_criacao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCriacao: Date;

  @OneToOne(() => ServiceProvider, (premisor) => premisor.usuario)
  prestador?: ServiceProvider;
}
