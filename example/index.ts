

import { Bingo, Router } from '../mod.ts'

const app = new Bingo()
const router = new Router()
router.get('/', async (ctx, next) => {
  ctx.body = '首页'
  throw new Error('123')
  await next()
}, (ctx) => {
  // ctx.throw(500)
  throw new Error('123')
})
app.use(async (ctx, next) => {
  ctx.body = 'hello bingo'
  await next()
  console.log('你猜', ctx.status)
  if (ctx.status === 500) {
    ctx.type = 'application/json;charset=utf-8'
    ctx.body = {
      code: 500,
      msg: ctx.message,
      result: null
    }
  }
})
.use(async (ctx, next) => {
  throw new Error('报错')
  await next()
})
.use(router.routes())
.listen(8888, () => {
  console.log('端口监听8888')
})