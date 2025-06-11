import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from '../../config/typeorm';
import { User } from './entities/user.entity';
import { ServiceProvider } from './entities/service-provider.entity';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';
import { ContactClick } from './entities/contact-click.entity';
import { CategoryVisit } from './entities/category-visit.entity';
import { ServiceProviderVisit } from './entities/service-provider-visit.entity';
import { InvitationToken } from './entities/Invitation-token.entity';
import { Service } from './entities/service.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          Category,
          CategoryVisit,
          ContactClick,
          InvitationToken,
          Review,
          Service,
          ServiceProvider,
          ServiceProviderVisit,
          User,
        ],
        migrations: ['dist/migrations/*{.ts,.js}'],
        synchronize: false, // em produção deixe false e use migrações
        migrationsRun: true, // ou false, se preferir disparar manualmente
        logging: config.get('NODE_ENV') !== 'production',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
