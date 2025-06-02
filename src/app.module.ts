import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { PrestadoresModule } from './modules/prestadores/prestadores.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ServicosModule } from './modules/servicos/servicos.module';
import { AvaliacoesModule } from './modules/avaliacoes/avaliacoes.module';
import { MetricasModule } from './modules/metricas/metricas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AdminModule,
    PrestadoresModule,
    CategoriasModule,
    ServicosModule,
    AvaliacoesModule,
    MetricasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
