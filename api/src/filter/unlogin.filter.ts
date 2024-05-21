// 自定义一个未登陆异常过滤，为了统一返回值格式
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

export class UnLoginException {
  message: string;

  constructor(message) {
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnLoginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    response.json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: exception.message || '未登录',
    });
  }
}
