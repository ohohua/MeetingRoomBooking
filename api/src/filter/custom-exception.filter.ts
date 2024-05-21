// 为所有异常统一响应格式
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    const res = exception.getResponse() as { message: string[] };
    response
      .json({
        code: exception.getStatus(),
        message: 'fail',
        data: res?.message?.join('，') || exception.message,
      })
      .end();
  }
}
