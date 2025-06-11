import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServiceProviderModule } from './modules/serviceProvider/service-provider.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ServicesModule } from './modules/services/services.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MetricasModule } from './modules/metricas/metricas.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    ServiceProviderModule,
    CategoriasModule,
    ServicesModule,
    ReviewsModule,
    MetricasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
