import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET')!;
    if (!secret) {
      throw new Error('JWT_SECRET não definido no .env');
    }

    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    super(opts);
  }

  async validate({ sub }: JwtPayload) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: sub },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
    };
  }
}
