

import { Bingo, Router } from '../mod.ts'

const app = new Bingo()
const router = new Router()
router.get('/', async (ctx, next) => {
  ctx.body = '首页'
  await next()
}, (ctx) => {
  // ctx.throw(500)
  throw new Error('123')
})
app.use(async (ctx, next) => {
  ctx.body = 'hello bingo'
  await next()
})
.use(router.routes())
.listen(8888, () => {
  console.log('端口监听8888')
})