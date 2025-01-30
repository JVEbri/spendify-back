import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest(); // Obtiene la request desde el contexto
  return request.user; // Retorna el usuario extraído del token JWT
});
