import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard customizado para JWT que já lança UnauthorizedException por padrão
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Override do método interno que trata a requisição após o Passport rodar a estratégia.
   *
   * @param err Se ocorreu algum erro durante a validação do token
   * @param user Usuário validado (ou `undefined`/`null` se não autenticado)
   * @param info Informações adicionais de erro (ex: TokenExpiredError)
   * @param context Contexto da execução (não usado aqui, mas disponível se precisar)
   *
   * @returns Retorna sempre um JwtUser (lança erro caso contrário)
   */
  handleRequest<TUser extends JwtUser = JwtUser>(
    err: any,
    user: TUser | null | undefined,
    info?: Error,
    context?: ExecutionContext,
  ): TUser {
    // Se houve erro interno do Passport, propaga
    if (err) {
      console.error(info, context);
      throw err;
    }

    // Se não veio usuário válido, lança Unauthorized
    if (!user) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    // Retorna o usuário tipado como JwtUser
    return user;
  }
}
