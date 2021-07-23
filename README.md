# bingo

仿koa语法的deno版web框架

## Hello Bingo

```js
import { Bingo, Router } from 'https://deno.land/x/bingo@0.1.1/mod.ts'
const app = new Bingo()
const router = new Router()
router.get('/', (ctx, next) => {
  ctx.body = 'home'
})
router.get('/news/:id', (ctx, next) => {
  ctx.body = 'news' + ctx.params.id
  next()
}, (ctx, next) => {
  console.log(ctx.params.id)
})
// response
app.use(ctx => {
  ctx.body = 'Hello Bingo';
  next()
})
app.use(router.routes())
app.listen(3000);
```


