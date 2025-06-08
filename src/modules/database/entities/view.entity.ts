import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceProvider } from './prestador.entity';

@Entity({ name: 'visitas_prestador' })
export class View {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'prestador_id' }) prestadorId: number;

  @Column({
    name: 'data_hora',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataHora: Date;

  @Column({ type: 'enum', enum: OrigemVisita }) origem: OrigemVisita;

  @ManyToOne(() => ServiceProvider, (prestador) => prestador.visitas)
  @JoinColumn({ name: 'prestador_id' })
  prestador: ServiceProvider;
}
