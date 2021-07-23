# bingo

仿koa语法的deno版web框架

## Hello Bingo

```js
import Bingo from 'https://deno.land/x/bingo@0.1.0/server.ts'
const app = new Bingo();

// response
app.use(ctx => {
  ctx.body = 'Hello Bingo';
});

app.listen(3000);
```


