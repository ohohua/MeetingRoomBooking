import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('permission guard');

    const request = context.switchToHttp().getRequest();
    // user 是在 login.guard.ts 中添加的
    if (!request.user) {
      return true;
    }

    const permissions = request.user.permissions;

    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );

    if (!requirePermissions) {
      return true;
    }

    requirePermissions.forEach((item) => {
      if (!permissions.includes(item)) {
        throw new UnauthorizedException('您没有权限访问该接口');
      }
    });
    return true;
  }
}
