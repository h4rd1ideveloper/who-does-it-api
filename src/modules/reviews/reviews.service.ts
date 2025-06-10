import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../database/entities/review.entity';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { CreateReviewDto } from './create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepo: Repository<ServiceProvider>,
  ) {}

  async listReviewsByServiceProvider(serviceProviderId: number) {
    const reviews = await this.reviewRepo.find({
      where: { serviceProviderId },
      order: {
        createdAt: 'desc',
      },
    });

    return reviews.map(
      ({ id, serviceProviderId, clientName, rating, comment, createdAt }) => ({
        id,
        serviceProviderId,
        clientName,
        rating,
        comment,
        createdAt: createdAt.toISOString(),
      }),
    );
  }

  async createReview({
    serviceProviderId,
    comment,
    clientName,
    rating,
  }: CreateReviewDto) {
    // Verificar se o prestador existe
    const serviceProvider = await this.serviceProviderRepo.find({
      where: { id: serviceProviderId },
    });

    if (!serviceProvider) {
      throw new BadRequestException('Service provider not found');
    }

    // Validar nota
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('The rating must be between 1 and 5');
    }

    // Criar avaliação
    const reviewData = this.reviewRepo.create({
      comment,
      rating,
      clientName,
      serviceProviderId,
    });
    const review = await this.reviewRepo.save(reviewData);
    return {
      id: review.id,
      serviceProviderId: review.serviceProviderId,
      clientName: review.clientName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    };
  }

  async getReviewById(id: number) {
    const review = await this.reviewRepo.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return {
      id: review.id,
      serviceProviderId: review.serviceProviderId,
      clientName: review.clientName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
