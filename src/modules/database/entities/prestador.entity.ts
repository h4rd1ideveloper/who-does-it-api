import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './usuario.entity';
import { Servico } from './servico.entity';
import { Review, CliqueContato, VisitaPrestador } from './avaliacao.entity';

// Prestador
@Entity({ name: 'prestadores' })
export class ServiceProvider {
  @PrimaryGeneratedColumn({ name: 'id' }) id: number;

  @Column({ name: 'cpf_cnpj', nullable: true }) cpfCnpj?: string;

  @Column() telefone: string;

  @Column() endereco: string;

  @Column() cidade: string;

  @Column() estado: string;

  @Column() cep: string;

  @Column({ name: 'atende_domicilio', default: false })
  atendeDomicilio: boolean;

  @Column({ name: 'horario_funcionamento', nullable: true })
  horarioFuncionamento?: string;

  @Column({ name: 'foto_url', nullable: true }) fotoUrl?: string;

  @Column({ name: 'is_ativo', default: true }) isAtivo: boolean;

  @Column({
    name: 'data_cadastro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCadastro: Date;

  @OneToOne(() => User, (usuario) => usuario.prestador)
  @JoinColumn({ name: 'id' })
  usuario: User;

  @OneToMany(() => Servico, (servico) => servico.prestador) servicos: Servico[];

  @OneToMany(() => Review, (avaliacao) => avaliacao.prestador)
  avaliacoes: Review[];

  @OneToMany(() => VisitaPrestador, (visita) => visita.prestador)
  visitas: VisitaPrestador[];

  @OneToMany(() => CliqueContato, (clique) => clique.prestador)
  cliques: CliqueContato[];
}

