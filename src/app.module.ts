import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServiceProviderModule } from './modules/serviceProvider/service-provider.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ServicosModule } from './modules/service/servicos.module';
import { AvaliacoesModule } from './modules/avaliacoes/avaliacoes.module';
import { MetricasModule } from './modules/metricas/metricas.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    //PrismaModule,
    AuthModule,
    AdminModule,
    ServiceProviderModule,
    CategoriasModule,
    ServicosModule,
    AvaliacoesModule,
    MetricasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
