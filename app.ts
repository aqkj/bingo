
/**
 * app逻辑
 */
import { serve, Server, ServerRequest } from 'https://deno.land/std@0.102.0/http/server.ts'

// deno-lint-ignore no-namespace
namespace Bingo {
  export interface IAppOptions {
    port: number
  }
  export interface IMiddleWare{
    (ctx: IContext, next: CallableFunction): Promise<unknown> | unknown
  }
  export type IContext = ServerRequest
}
class App {
  /** 配置 */
  private options?: Bingo.IAppOptions
  /** 服务 */
  private server?: Server
  /** 存储中间件 */
  private middlewares: Bingo.IMiddleWare[] = []
  constructor(options?: Bingo.IAppOptions) {
    this.options = options
  }
  /**
   * 触发中间件
   * @param ctx 上下文对象
   */
  private async callMiddlewares(ctx: Bingo.IContext) {
    // 存储位置
    let nextCount = 0
    const fn = async (index: number) => {
      // 当前中间件方法
      const middleware = this.middlewares[index]
      // 增加
      nextCount += 1
      // 下一个中间件
      const nextMiddleware = fn.bind(null, nextCount)
      // 存在则执行
      if (middleware) {
        await middleware.call(null, ctx, nextMiddleware)
          // 如果上一个执行完
        if (nextCount === index + 1) await nextMiddleware()
      }
    }
    // 调用
    await fn(nextCount)
  }
  /**
   * 挂载插件
   * @param {Bingo.IMiddleWare} middleware 中间件方法
   */
  use(middleware: Bingo.IMiddleWare) {
    // 插入中间件
    this.middlewares.push(middleware)
    return this
  }
  /**
   * 监听端口
   * @param {number} port 端口号
   * @param {CallableFunction} callback 回调
   */
  async listen(port: number, callback?: CallableFunction) {
    // 创建服务
    this.server = serve({
      port,
    })
    // 回调
    callback && callback()
    for await (const req of this.server) {
      (async () => {
        await this.callMiddlewares(req)
      })()
    }
  }
}

export default App