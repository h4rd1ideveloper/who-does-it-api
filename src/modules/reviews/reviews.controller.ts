import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('prestador/:prestadorId') async listReviewsByServiceProvider(
    @Param('prestadorId') prestadorId: string,
  ) {
    return this.reviewsService.listReviewsByServiceProvider(
      parseInt(prestadorId),
    );
  }

  @Post() async createReview(@Body() data: CreateReviewDto) {
    return this.reviewsService.createReview(data);
  }

  @Get(':id') async getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(parseInt(id));
  }
}
