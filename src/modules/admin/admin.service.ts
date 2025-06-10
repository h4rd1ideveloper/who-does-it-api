import { Injectable } from '@nestjs/common';
//import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { Repository } from 'typeorm';
import { ServiceProviderVisit } from '../database/entities/service-provider-visit.entity';
import { ContactClick } from '../database/entities/contact-click.entity';
import { Category } from '../database/entities/category.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepo: Repository<ServiceProvider>,

    @InjectRepository(ServiceProviderVisit)
    private readonly visitRepo: Repository<ServiceProviderVisit>,

    @InjectRepository(ContactClick)
    private readonly clickRepo: Repository<ContactClick>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    //private readonly jwtService: JwtService,
  ) {}

  gerarTokenConvite(validadeDias: number) {
    const token = v4();
    const dataExpiracao = add(new Date(), { days: validadeDias });

    // Em um ambiente real, salvaríamos o ‘token’ numa tabela específica
    // ou atualizaríamos um registro existente

    return {
      token,
      data_expiracao: dataExpiracao.toISOString().split('T')[0],
    };
  }

  async getEstatisticasGerais() {
    const totalPrestadores = await this.serviceProviderRepo.count();
    const totalVisitas = await this.visitRepo.count();
    const totalCliques = await this.clickRepo.count();

    return {
      total_prestadores: totalPrestadores,
      total_visitas: totalVisitas,
      total_cliques: totalCliques,
    };
  }

  async getTopCategorias(periodo: number) {
    const dataLimite = add(new Date(), { days: -periodo });
    console.log(dataLimite);
    // Consulta simplificada: ordena pela data de criação ou ‘id’
    const categorias = await this.categoryRepo.find({
      take: 5,
      order: { id: 'ASC' },
    });

    // Simulação de visitas
    return categorias.map((categoria) => ({
      categoria_id: categoria.id,
      nome: categoria.name,
      total_visitas: Math.floor(Math.random() * 100) + 20,
    }));
  }

  async getTopPrestadores(periodo: number) {
    const dataLimite = add(new Date(), { days: -periodo });
    console.log(dataLimite);
    // Busca serviceProvider com relação ao utilizador
    const prestadores = await this.serviceProviderRepo.find({
      take: 5,
      relations: ['user'],
      order: { id: 'ASC' },
    });

    // Simulação de visitas
    return prestadores.map((prestador) => ({
      prestador_id: prestador.id,
      nome: prestador.user.name,
      total_visitas: Math.floor(Math.random() * 50) + 10,
    }));
  }
}
