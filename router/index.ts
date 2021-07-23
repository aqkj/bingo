/**
 * 入口
 */
import { BingoMiddleWare } from '../server/app.ts'
import { BingoContext } from '../server/context.ts'
import { callMiddlewares } from '../utils.ts'
interface IRouterOptions {
  prefix?: string
}
interface IRouteItem {
  path: string
  method: string
  middlewares: BingoMiddleWare[]
}
declare module '../server/context.ts' {
  interface BingoContext {
    params: Record<string, unknown>
  }
}
/**
 * 路由类
 */
export class Router {
  private prefix: string
  private routeArr: IRouteItem[] = []
  constructor(options: IRouterOptions = {}) {
    this.prefix = options.prefix || ''
  }
  /**
   * 定义路由
   * @param path 路径
   * @param method 方法
   * @param middlewares 中间件
   * @returns
   */
  private route(path: string, method = 'get', ...middlewares: BingoMiddleWare[]) {
    if (!path || !middlewares.length) return
    const routeItem: IRouteItem = {
      path,
      method,
      middlewares
    }
    this.routeArr.push(routeItem)
    return this
  }
  /**
   * get注册路由
   * @param path 路径
   * @param middlewares 中间件
   * @returns 
   */
  get(path: string, ...middlewares: BingoMiddleWare[]) {
    return this.route(path, 'get', ...middlewares)
  }
  /**
   * 匹配路由
   * @param {BingoContext} ctx 上下文
   */
  private matchRoutes(ctx: BingoContext) {
    // 变量路由数组
    const currRoute = this.routeArr.find(route => {
      // 请求路径数组
      const requestPaths = ctx.path.split('/').slice(1)
      // 路由路径数组
      const routePaths = route.path.split('/').slice(1)
      // 暂存变量
      const params: Record<string, string> = {}
      // 判断是否匹配成功
      const matchSuccess = routePaths.every((routePath, index) => {
        routePath = routePath.trim()
        const requestPath = (requestPaths[index] || '').trim()
        const hasParams = routePath[0] === ':'
        // 是否为变量
        if (requestPath && hasParams) {
          // 获取属性名
          const propName = routePath.slice(1)
          // 设置内容
          params[propName] = requestPath
          // 返回成功
          return true
        } else {
          // 判断路径是否相同
          return requestPath === routePath
        }
      })
      // 路由匹配成功，并且请求方法相同
      if (matchSuccess && ctx.method === route.method) {
        // 设置参数
        ctx.params = params
        return true
      } else return false
    })
    return currRoute
  }
  /**
   * route匹配处理中间件
   * @returns 
   */
  routes() {
    return async (ctx: BingoContext, next: () => Promise<void>) => {
      // 获取匹配路由
      const currRoute = this.matchRoutes(ctx)
      // 匹配成功
      if (currRoute) {
        try {
          // 遍历中间件
          await callMiddlewares(ctx, [...currRoute.middlewares, next])
        } catch (error) {
          // 发送错误事件
          ctx.app.emit('error', error)
        }
      } else {
        ctx.status = 404
        ctx.message = 'NotFound'
        ctx.body = '404 NotFound'
      }
    }
  }
}