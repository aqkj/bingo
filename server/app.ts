
/**
 * app逻辑
 */
import { serve, Server, ServerRequest } from 'https://deno.land/std@0.102.0/http/server.ts'
import { BingoContext } from './context.ts'
import { BingoRequest } from './request.ts'
import { BingoResponse } from './response.ts'
import { callMiddlewares } from '../utils.ts'
import { Event } from '../event.ts'
/**
 * 中间件接口
 */
export interface BingoMiddleWare{
  (ctx: BingoContext, next: () => Promise<void>): Promise<unknown> | unknown
}
/**
 * Bingo类
 */
export class BingoApp extends Event {
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
    // 监听错误事件
    this.on('error', (error: unknown) => {
      this.handlerError(error)
    })
    // 回调
    callback && callback()
    // 遍历
    for await (const req of this.server) {
      (async () => {
        try {
          // 初始化context
          const ctx = this.initContext(req)
          // 调用中间件
          await callMiddlewares(ctx, this.middlewares)
        } catch (error) {
          // 发送错误事件
          this.emit('error', error)
        }
        // 处理结果
        await this.respond(req)
      })()
    }
  }
  /**
   * 处理错误
   * @param req 
   */
  private handlerError(error: unknown) {
    console.error(error)
    this.context.status = 500
    this.context.message = 'Internal server error'
    this.context.body = '500 Internal server error'
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
