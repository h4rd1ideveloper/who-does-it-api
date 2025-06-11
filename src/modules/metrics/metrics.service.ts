import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviderVisit } from '../database/entities/service-provider-visit.entity';
import { ContactClick } from '../database/entities/contact-click.entity';
import { CreateVisitDto } from './create-visit.dto';
import { CreateContactClickDto } from './create-contact-click.dto';
import { CategoryVisit } from '../database/entities/category-visit.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(ServiceProviderVisit)
    private readonly visitRepo: Repository<ServiceProviderVisit>,
    @InjectRepository(ContactClick)
    private readonly clickRepo: Repository<ContactClick>,

    @InjectRepository(CategoryVisit)
    private readonly categoryVisitRepo: Repository<CategoryVisit>,
    ) {}

  async registerVisit(data: CreateVisitDto) {
    if (!data.providerId || !data.visitOrigin) {
      throw new BadRequestException('providerId and visitOrigin are required');
    }
    await this.visitRepo.save(
      this.visitRepo.create({
        serviceProviderId: data.providerId,
        visitOrigin: data.visitOrigin,
      }),
    );
    return { success: true };
  }

  async registerClick(data: CreateContactClickDto) {
    if (!data.providerId || !data.contactType) {
      throw new BadRequestException('providerId and contactType are required');
    }
    await this.clickRepo.save(
      this.clickRepo.create({
        serviceProviderId: data.providerId,
        contactType: data.contactType,
      }),
    );
    return { success: true };
  }

  async registerCategoryVisit(categoryId: number) {
    if (!categoryId) {
      throw new BadRequestException('categoryId is required');
    }
    await this.categoryVisitRepo.save(
      this.categoryVisitRepo.create({ categoryId }),
    );
    return { success: true };
  }

  async getVisitMetricsByPeriod(providerId: number, period: number) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - period);

    const raw = await this.visitRepo
      .createQueryBuilder('visit')
      .select("TO_CHAR(visit.visited_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(visit.id)', 'totalVisits')
      .where('visit.service_provider_id = :providerId', { providerId })
      .andWhere('visit.visited_at >= :dataLimite', { dataLimite })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; totalVisits: string }>();

    return raw.map((r) => ({
      data: r.date,
      totalVisits: parseInt(r.totalVisits, 10),
    }));
  }

  async getClickMetricsByPeriod(providerId: number, period: number) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - period);

    const raw = await this.clickRepo
      .createQueryBuilder('click')
      .select("TO_CHAR(click.clicked_at, 'YYYY-MM-DD')", 'date')
      .addSelect('click.contact_type', 'contactType')
      .addSelect('COUNT(click.id)', 'totalClicks')
      .where('click.service_provider_id = :providerId', { providerId })
      .andWhere('click.clicked_at >= :dataLimite', { dataLimite })
      .groupBy('date')
      .addGroupBy('click.contact_type')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; contactType: string; totalClicks: string }>();

    return raw.map((r) => ({
      data: r.date,
      contactType: r.contactType,
      totalClicks: parseInt(r.totalClicks, 10),
    }));
  }


  async getCategoryMetricsByPeriod(period: number) {
    const dataLimit = new Date();
    dataLimit.setDate(dataLimit.getDate() - period);

    const raw = await this.categoryVisitRepo
      .createQueryBuilder('visit')
      .select("TO_CHAR(visit.visited_at, 'YYYY-MM-DD')", 'date')
      .addSelect('visit.category_id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(visit.id)', 'totalVisits')
      .innerJoin('visit.category', 'category')
      .where('visit.visited_at >= :dataLimit', { dataLimit })
      .groupBy('date')
      .addGroupBy('visit.category_id')
      .addGroupBy('category.name')
      .orderBy('date', 'ASC')
      .addOrderBy('totalVisits', 'DESC')
      .getRawMany<{ date: string; categoryId: number; categoryName: string; totalVisits: string }>();

    return raw.map((r) => ({
      date: r.date,
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      totalVisits: parseInt(r.totalVisits, 10),
    }));
  }
}
