import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateServiceProviderDto } from './create-service-provider.dto';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { User } from '../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../database/entities/service.entity';
import { Category } from '../database/entities/category.entity';
import { Review } from '../database/entities/review.entity';


@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepository: Repository<ServiceProvider>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  validateToken(token: string) {
    if (!token || token.length < 5) {
      throw new BadRequestException('Invalid or expired token');
    }
    return { valid: true };
  }

  async register(data: CreateServiceProviderDto) {
    this.validateToken(data.token);

    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      userType: UserType.SERVICE_PROVIDER,
    });

    const savedUser = await this.userRepository.save(user);

    const serviceProvider = this.serviceProviderRepository.create({
      id: savedUser.id,
      cpfCnpj: data.cpfCnpj,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      homeService: data.homeService,
      businessHours: data.businessHours,
      photoUrl: data.photoUrl,
      isActive: true,
    });

    const savedServiceProvider = await this.serviceProviderRepository.save(serviceProvider);

    if (data.services && data.services.length > 0) {
      for (const serviceData of data.services) {
        const service = this.serviceRepository.create({
          serviceProviderId: savedServiceProvider.id,
          categoryId: serviceData.categoryId,
          title: serviceData.title,
          description: serviceData.description,
          priceMin: serviceData.priceMin,
          priceMax: serviceData.priceMax,
          estimatedTime: serviceData.estimatedTime,
          serviceLocation: serviceData.serviceLocation as ServiceLocation,
          photoUrls: serviceData.photoUrls
            ? JSON.stringify(serviceData.photoUrls)
            : '',
        });
        await this.serviceRepository.save(service);
      }
    }

    return {
      providerId: savedServiceProvider.id,
      message: 'Registration successful',
    };
  }

  async searchProviders(
    query?: string,
    categorySlug?: string,
    city?: string,
    orderBy?: string,
  ) {
    let qb = this.serviceProviderRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.user', 'user')
      .leftJoinAndSelect('provider.services', 'service')
      .leftJoinAndSelect('provider.reviews', 'review')
      .leftJoinAndSelect('service.category', 'category')
      .where('provider.isActive = true');

    if (query) {
      qb = qb.andWhere(
        '(service.title ILIKE :query OR service.description ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (categorySlug) {
      qb = qb.andWhere('category.slug = :slug', { slug: categorySlug });
    }

    if (city) {
      qb = qb.andWhere('provider.city ILIKE :city', { city: `%${city}%` });
    }

    if (
      orderBy === 'most_visited' ||
      orderBy === 'best_rated' ||
      orderBy === 'lowest_price'
    ) {
      qb = qb.orderBy('provider.id', 'ASC'); // Placeholder logic
    } else {
      qb = qb.orderBy('provider.id', 'ASC');
    }

    const providers = await qb.getMany();

    return providers.map((provider) => {
      const averageRating =
        provider.reviews.length > 0
          ? provider.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
            provider.reviews.length
          : 0;

      const prices = provider.services
        .map((s) => [s.priceMin, s.priceMax ?? s.priceMin])
        .flat();
      const priceMin = prices.length ? Math.min(...prices) : null;
      const priceMax = prices.length ? Math.max(...prices) : null;

      return {
        providerId: provider.id,
        name: provider.user.name,
        photoUrl: provider.photoUrl,
        averageRating: +averageRating.toFixed(1),
        totalReviews: provider.reviews.length,
        priceMin,
        priceMax,
        slogan: provider.services[0]?.title ?? '',
        serviceLocation: provider.services[0]?.serviceLocation ?? null,
      };
    });
  }

  async getProviderProfile(id: number) {
    const provider = await this.serviceProviderRepository.findOne({
      where: { id },
      relations: ['user', 'services', 'services.category', 'reviews'],
    });

    if (!provider) {
      throw new NotFoundException('Service provider not found');
    }

    const averageRating =
      provider.reviews.length > 0
        ? provider.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
          provider.reviews.length
        : 0;

    const services = provider.services.map((s) => ({
      id: s.id,
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
      photoUrls: s.photoUrls,
    }));

    const reviews = provider.reviews.map((r) => ({
      clientName: r.clientName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }));

    const contacts = {
      whatsapp: provider.phone,
      email: provider.user.email,
      phone: provider.phone,
      externalSite: null,
    };

    return {
      id: provider.id,
      name: provider.user.name,
      photoUrl: provider.photoUrl,
      averageRating: +averageRating.toFixed(1),
      totalReviews: provider.reviews.length,
      description: '',
      address: provider.address,
      city: provider.city,
      state: provider.state,
      zipCode: provider.zipCode,
      homeService: provider.homeService,
      businessHours: provider.businessHours,
      services,
      reviews,
      contacts,
    };
  }

  getVisitMetrics(providerId: number, days: number) {
    const today = new Date();
    const result: { date: string; totalVisits: number }[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push({
        date: date.toISOString().split('T')[0],
        totalVisits: Math.floor(Math.random() * 20) + 1,
      });
    }

    return result.reverse();
  }

  getClickMetrics(providerId: number, days: number) {
    const today = new Date();
    const contactTypes = ['whatsapp', 'email', 'phone'];
    const result: { date: string; contactType: string; totalClicks: number }[] =
      [];

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      for (const type of contactTypes) {
        result.push({
          date: date.toISOString().split('T')[0],
          contactType: type,
          totalClicks: Math.floor(Math.random() * 10) + 1,
        });
      }
    }

    return result.reverse();
  }
}
