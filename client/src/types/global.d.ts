import "";
declare global {
  // 定义请求响应参数
  interface Result<T> {
    code: number;
    message: string;
    data: T;
  }
}
