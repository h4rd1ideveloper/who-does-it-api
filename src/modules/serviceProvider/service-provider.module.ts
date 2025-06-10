import { Module } from '@nestjs/common';
import { ServiceProviderController } from './service-provider.controller';
import { ServiceProviderService } from './service-provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { Category } from '../database/entities/category.entity';
import { User } from '../database/entities/user.entity';
import { Service } from '../database/entities/service.entity';
import { Review } from '../database/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceProvider,
      User,
      Service,
      Category,
      Review,
    ]),
  ],
  controllers: [ServiceProviderController],
  providers: [ServiceProviderService],
  exports: [ServiceProviderService],
})
export class ServiceProviderModule {}
