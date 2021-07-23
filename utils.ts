
import { BingoContext } from './server/context.ts'
import { BingoMiddleWare } from './server/app.ts'
/**
 * 调用中间件
 * @param ctx 上下文
 * @param middlewares 中间件
 */
export async function callMiddlewares(ctx: BingoContext, middlewares: BingoMiddleWare[]) {
  // 存储位置
  let nextCount = 0
  const fn = async (index: number) => {
    // 当前中间件方法
    const middleware = middlewares[index]
    // 增加
    nextCount += 1
    // 下一个中间件
    const nextMiddleware = fn.bind(null, nextCount)
    // 存在则执行
    if (middleware) {
      await middleware.call(null, ctx, nextMiddleware)
        // 如果上一个执行完
      // if (nextCount === index + 1) await nextMiddleware()
    }
  }
  // 调用
  await fn(nextCount)
}