import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ContactClick } from './entities/contact-click.entity';
import { Review } from './entities/review.entity';
import { Service } from './entities/service.entity';
import { ServiceProvider } from './entities/service-provider.entity';
import { ServiceProviderVisit } from './entities/service-provider-visit.entity';
import { User } from './entities/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule, // para injetar ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          Category,
          ContactClick,
          Review,
          Service,
          ServiceProvider,
          ServiceProviderVisit,
          User
        ],
        synchronize: false,      // em produção deixe false e use migrações
        migrationsRun: true,     // ou false, se preferir disparar manualmente
        logging: config.get('NODE_ENV') !== 'production',
        migrations: ['dist/migrations/*.js'],
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}