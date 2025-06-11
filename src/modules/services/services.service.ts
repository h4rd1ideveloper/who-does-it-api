import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../database/entities/service.entity';
import { Category } from '../database/entities/category.entity';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { CreateServiceDto } from './create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
  ) {}

  /** Lista todos os serviços de um prestador */
  async listByProvider(providerId: number) {
    const services = await this.serviceRepo.find({
      where: { serviceProviderId: providerId },
      relations: ['category'],
      order: { id: 'ASC' },
    });

    return services.map((s) => ({
      id: s.id,
      serviceProviderId: s.serviceProviderId,
      categoryId: s.categoryId,
      category: {
        id: s.category.id,
        name: s.category.name,
        slug: s.category.slug,
      },
      title: s.title,
      description: s.description,
      priceMin: s.priceMin,
      priceMax: s.priceMax,
      estimatedTime: s.estimatedTime,
      serviceLocation: s.serviceLocation,
      photoUrls: s.photoUrls ? JSON.parse(s.photoUrls) : [],
    }));
  }

  /** Obtém um serviço pelo ‘ID’ */
  async getById(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return {
      id: service.id,
      serviceProviderId: service.serviceProviderId,
      categoryId: service.categoryId,
      category: {
        id: service.category.id,
        name: service.category.name,
        slug: service.category.slug,
      },
      title: service.title,
      description: service.description,
      priceMin: service.priceMin,
      priceMax: service.priceMax,
      estimatedTime: service.estimatedTime,
      serviceLocation: service.serviceLocation,
      photoUrls: service.photoUrls ? JSON.parse(service.photoUrls) : [],
    };
  }

  /** Cria um serviço */
  async create(data: CreateServiceDto) {
    // validações
    const category = await this.categoryRepo.findOne({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const provider = await this.providerRepo.findOne({
      where: { id: data.serviceProviderId },
    });
    if (!provider) {
      throw new BadRequestException('ServiceProvider not found');
    }

    // criação
    const entity = this.serviceRepo.create({
      serviceProviderId: data.serviceProviderId,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      estimatedTime: data.estimatedTime,
      serviceLocation: data.serviceLocation as ServiceLocation,
      photoUrls:
        data.photoUrls && data.photoUrls.length
          ? JSON.stringify(data.photoUrls)
          : '',
    });
    const saved = await this.serviceRepo.save(entity);

    return this.getById(saved.id);
  }

  /** Atualiza um serviço existente */
  async update(id: number, data: Partial<CreateServiceDto>) {
    const existing = await this.serviceRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Service not found');
    }

    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    // merge e save
    const updated = this.serviceRepo.merge(existing, {
      categoryId: data.categoryId ?? existing.categoryId,
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      priceMin: data.priceMin ?? existing.priceMin,
      priceMax: data.priceMax ?? existing.priceMax,
      estimatedTime: data.estimatedTime ?? existing.estimatedTime,
      serviceLocation: data.serviceLocation ?? existing.serviceLocation,
      photoUrls:
        data.photoUrls !== undefined
          ? JSON.stringify(data.photoUrls)
          : existing.photoUrls,
    });
    const saved = await this.serviceRepo.save(updated);

    return this.getById(saved.id);
  }

  /** Remove um serviço */
  async remove(id: number) {
    const existing = await this.serviceRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Service not found');
    }
    await this.serviceRepo.remove(existing);
    return { message: 'Service deleted successfully' };
  }
}
