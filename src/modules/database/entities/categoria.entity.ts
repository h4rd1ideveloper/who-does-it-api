
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Servico } from './servico.entity';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true }) nome: string;

  @Column({ unique: true }) slug: string;

  @Column({ name: 'imagem_url', nullable: true }) imagemUrl?: string;

  @OneToMany(() => Servico, (servico) => servico.categoria) servicos: Servico[];
}
