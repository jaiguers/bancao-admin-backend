import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthPayload } from '../interfaces/auth.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAuthPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
