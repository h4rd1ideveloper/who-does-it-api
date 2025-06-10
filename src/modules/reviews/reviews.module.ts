import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { Review } from '../database/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      ServiceProvider
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
