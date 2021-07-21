# bingo

仿koa语法的deno版web框架

## Hello Bingo

```js
const app = new Bingo();

// response
app.use(ctx => {
  ctx.body = 'Hello Bingo';
});

app.listen(3000);
```


