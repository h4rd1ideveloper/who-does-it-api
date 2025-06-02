import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { email, tipo_usuario: 'admin' },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return { id: usuario.id, email: usuario.email, tipo_usuario: usuario.tipo_usuario };
  }

  async validatePrestador(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { email, tipo_usuario: 'prestador' },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const prestador = await this.prisma.prestador.findUnique({
      where: { id: usuario.id },
    });

    if (!prestador || !prestador.is_ativo) {
      throw new UnauthorizedException('Prestador inativo ou não encontrado');
    }

    return { 
      id: usuario.id, 
      email: usuario.email, 
      tipo_usuario: usuario.tipo_usuario,
      prestador_id: prestador.id
    };
  }

  async loginAdmin(email: string, senha: string) {
    const usuario = await this.validateAdmin(email, senha);
    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo_usuario };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async loginPrestador(email: string, senha: string) {
    const usuario = await this.validatePrestador(email, senha);
    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo_usuario };
    return {
      token: this.jwtService.sign(payload),
      prestador_id: usuario.prestador_id
    };
  }
}
