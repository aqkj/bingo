# bingo

仿koa语法的deno版web框架

## Hello Bingo

```js
import { Bingo, Router } from 'https://deno.land/x/bingo/mod.ts'
const app = new Bingo()
const router = new Router()
router.get('/', (ctx, next) => {
  ctx.body = 'home'
})
router.post('/news/:id', async (ctx, next) => {
  ctx.body = 'news' + ctx.params.id
  await next()
}, (ctx, next) => {
  console.log(ctx.params.id)
})
// response
app.use(async ctx => {
  ctx.body = 'Hello Bingo'
  await next()
})
app.use(router.routes())
app.listen(3000, () => {
  console.log('端口监听3000')
});
```


