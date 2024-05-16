import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('require-login', true);

export const RequirePermission = (...permission: string[]) =>
  SetMetadata('require-permission', permission);

/**
 * 自定义参数装饰器
 * key 为装饰器传入的参数
 */
export const UserInfo = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request.user) {
    return null;
  }
  return key ? request.user[key] : request.user;
});
