## record

1. 定义全局 `global.d.ts` 文件不仅要在`tsconfig.json`中配置`include`，还要在`global.d.ts`中导入`import ''`，否则会报错。因为在没有引入任何模块的情况下，TypeScript 不会识别该文件作为一个模块，并将它视为全局文件。

2. 封装 axios
   一直以来我都误认为 `AxiosResponse<T>` 就是最终的返回值，但是当我在响应拦截里将 `return response` 改为 `return response.data` 时，
   可以发现，`AxiosResponse<T>` 并不是最终的返回值。最终的返回值应该是 `response.data` 对应的类型。
   所以目前有两种方式来使用正确的类型标注，1）封装 `get` 等方法，标注其返回为 `Promise<Result<T>>`。 2）`get` 方法的泛型传`<TypeData, Result<TypeData>>` 来覆盖 `R = AxiosResponse<T>`

```ts
export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}

get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;

```
