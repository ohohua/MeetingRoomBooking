// 为所有异常统一响应格式
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  /**
   * 处理HTTP异常。
   * 当发生HTTP异常时，此方法将被调用以生成适当的错误响应。
   *
   * @param exception HttpException - 发生的HTTP异常实例。
   * @param host ArgumentsHost - 一个表示当前执行上下文的类，用于获取HTTP响应对象。
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    // 切换到HTTP上下文并获取响应对象
    const response: Response = host.switchToHttp().getResponse();

    // 从异常对象中获取错误响应信息
    const res = exception.getResponse() as { message: string[] };
    // 设置响应格式为JSON，并包含错误代码、消息和数据字段
    response
      .json({
        code: exception.getStatus(), // 设置错误代码为HTTP状态码
        message: 'fail', // 错误消息固定为'fail'
        data: res?.message || exception.message, // 错误详情取自异常对象的响应消息或直接取自异常对象的消息
      })
      .end(); // 结束响应
  }
}
