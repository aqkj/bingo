
/**
 * app逻辑
 */
import { serve, Server, ServerRequest } from 'https://deno.land/std@0.102.0/http/server.ts'
import { BingoContext } from './context.ts'
import { BingoRequest } from './request.ts'
import { BingoResponse } from './response.ts'
/**
 * 中间件接口
 */
interface BingoMiddleWare{
  (ctx: BingoContext, next: () => Promise<void>): Promise<unknown> | unknown
}
/**
 * Bingo类
 */
export class BingoApp {
  private context!: BingoContext
  private request!: BingoRequest
  private response!: BingoResponse
  /** 服务 */
  private server?: Server
  /** 存储中间件 */
  private middlewares: BingoMiddleWare[] = []
  /**
   * 初始化context
   * @param req 请求对象
   * @returns 
   */
  private initContext(req: ServerRequest): BingoContext {
    // 实例化context
    const ctx = new BingoContext(req)
    this.response = ctx.response
    this.request = ctx.request
    this.context = ctx
    ctx.app = this
    return ctx
  }
  /**
   * 触发中间件
   * @param ctx 上下文对象
   */
  private async callMiddlewares(ctx: BingoContext) {
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
   * @param {BingoMiddleWare} middleware 中间件方法
   */
  use(middleware: BingoMiddleWare) {
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
        const ctx = this.initContext(req)
        await this.callMiddlewares(ctx)
        await this.respond(req)
      })()
    }
  }
  /**
   * 响应
   */
  private respond(req: ServerRequest) {
    req.respond({
      status: this.response.status,
      headers: this.response.headers,
      body: this.response.body,
      statusText: this.response.message
    })
  }
}
