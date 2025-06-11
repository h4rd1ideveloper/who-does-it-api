import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProvider } from '../database/entities/service-provider.entity';
import { ServiceProviderVisit } from '../database/entities/service-provider-visit.entity';
import { ContactClick } from '../database/entities/contact-click.entity';
import { Category } from '../database/entities/category.entity';
import { InvitationToken } from '../database/entities/Invitation-token.entity';
import { CategoryVisit } from '../database/entities/category-visit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProvider,ServiceProviderVisit,ContactClick,Category,InvitationToken,CategoryVisit]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION', '24h'),
        },
      }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
