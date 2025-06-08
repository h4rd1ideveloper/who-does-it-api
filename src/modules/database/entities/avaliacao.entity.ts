
// Avaliação
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceProvider } from './prestador.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'prestador_id' }) prestadorId: number;

  @Column({ name: 'nome_cliente' }) nomeCliente: string;

  @Column() nota: number;

  @Column({ nullable: true }) comentario?: string;

  @Column({
    name: 'data_hora',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataHora: Date;

  @ManyToOne(() => ServiceProvider, (prestador) => prestador.avaliacoes)
  @JoinColumn({ name: 'prestador_id' })
  prestador: ServiceProvider;
}


