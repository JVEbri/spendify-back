import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest(); // Obtiene la request desde el contexto
  console.log('Request user', request.user);
  return request.user; // Retorna el usuario extraído del token JWT
});
