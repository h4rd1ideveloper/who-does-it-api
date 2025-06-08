import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceProvider } from './prestador.entity';

@Entity({ name: 'cliques_contato' })
export class Click {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'prestador_id' }) prestadorId: number;

  @Column({ type: 'enum', enum: TipoContato, name: 'tipo_contato' })
  tipoContato: TipoContato;

  @Column({
    name: 'data_hora',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataHora: Date;

  @ManyToOne(() => ServiceProvider, (prestador) => prestador.cliques)
  @JoinColumn({ name: 'prestador_id' })
  prestador: ServiceProvider;
}