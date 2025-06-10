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
import { InvitationToken } from '../database/entities/Invitation-token.entity';
import { CategoryVisit } from '../database/entities/category-visit.entity';

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
    @InjectRepository(InvitationToken)
    private readonly invitationTokenRepo: Repository<InvitationToken>, //private readonly jwtService: JwtService,
    @InjectRepository(CategoryVisit)
    private readonly categoryVisitRepo: Repository<CategoryVisit>,
  ) {}

  async createInvitationToken(validadeDias: number) {
    const tokenV4 = v4();
    const expiresAtDate = add(new Date(), { days: validadeDias });
    const savedInvitationToken = this.invitationTokenRepo.create({
      token: tokenV4,
      expiresAt: expiresAtDate.toISOString().split('T')[0],
    });
    const { token, expiresAt } =
      await this.invitationTokenRepo.save(savedInvitationToken);
    return {
      token,
      expiresAt,
    };
  }

  async getStatistics() {
    const totalProviders = await this.serviceProviderRepo.count();
    const totalVisits = await this.visitRepo.count();
    const totalClicks = await this.clickRepo.count();
    const totalCategories = await this.categoryRepo.count();
    const totalTokens = await this.invitationTokenRepo.count();
    const totalCategoryVisits = await this.categoryVisitRepo.count();

    return {
      total_providers: totalProviders,
      total_visits: totalVisits,
      total_clicks: totalClicks,
      total_categories: totalCategories,
      total_tokens: totalTokens,
      total_category_visits: totalCategoryVisits,
    };
  }

  async getRecentCategoryVisits(periodo: number) {
    const dataLimite = add(new Date(), { days: -periodo });

    // Consulta agregada: conta visitas por categoria no período, ordena decrescente e limita a 5
    const results = await this.categoryVisitRepo
      .createQueryBuilder('visit')
      .select('visit.category_id', 'categoryId')
      .addSelect('COUNT(visit.id)', 'totalVisits')
      .addSelect('category.name', 'categoryName')
      .innerJoin('visit.category', 'category')
      .where('visit.visitedAt >= :dataLimite', { dataLimite })
      .groupBy('visit.category_id')
      .addGroupBy('category.name')
      .orderBy('totalVisits', 'DESC')
      .limit(5)
      .getRawMany<{
        categoryId: number;
        totalVisits: string;
        categoryName: string;
      }>();

    // Formata o resultado
    return results.map((r) => ({
      category_id: r.categoryId,
      name: r.categoryName,
      total_visits: parseInt(r.totalVisits, 10),
    }));
  }

  async getRecentServiceProviderVisits(periodo: number) {
    const dataLimite = add(new Date(), { days: -periodo });

    const results = await this.visitRepo
      .createQueryBuilder('visit')
      .select('visit.service_provider_id', 'providerId')
      .addSelect('COUNT(visit.id)', 'totalVisits')
      .addSelect('provider_user.name', 'providerName')
      .innerJoin('visit.serviceProvider', 'provider')
      .innerJoin('provider.user', 'provider_user')
      .where('visit.visitedAt >= :dataLimite', { dataLimite })
      .groupBy('visit.service_provider_id')
      .addGroupBy('provider_user.name')
      .orderBy('totalVisits', 'DESC')
      .limit(5)
      .getRawMany<{
        providerId: number;
        totalVisits: string; // virá como ‘string’ do COUNT
        providerName: string;
      }>();

    return results.map((r) => ({
      service_provider_id: r.providerId,
      name: r.providerName,
      total_visits: parseInt(r.totalVisits, 10),
    }));
  }
}
