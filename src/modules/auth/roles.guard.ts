import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // lê os roles definidos no @Roles() do handler ou da classe
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // se não houver metadata de roles, libera acesso
    if (!requiredRoles) {
      return true;
    }

    // obtém o request já tipado
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user; // agora é JwtUser, não any

    // verifica se o tipo_usuario está entre os permitidos
    return requiredRoles.includes(user.tipo_usuario);
  }
}
