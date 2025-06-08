import { ServiceProvider } from './prestador.entity';
import { Categoria } from './categoria.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'servicos' })
export class Servico {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'prestador_id' }) prestadorId: number;

  @Column({ name: 'categoria_id' }) categoriaId: number;

  @Column() titulo: string;

  @Column() descricao: string;

  @Column({ name: 'preco_min', type: 'double precision' }) precoMin: number;

  @Column({ name: 'preco_max', type: 'double precision', nullable: true })
  precoMax?: number;

  @Column({ name: 'tempo_estimado' }) tempoEstimado: string;

  @Column({ type: 'enum', enum: LocalAtendimento, name: 'local_atendimento' })
  localAtendimento: LocalAtendimento;

  @Column({ name: 'fotos_urls', type: 'text', nullable: true })
  fotosUrls?: string;

  @ManyToOne(() => ServiceProvider, (prestador) => prestador.servicos)
  @JoinColumn({ name: 'prestador_id' })
  prestador: ServiceProvider;

  @ManyToOne(() => Categoria, (categoria) => categoria.servicos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}
