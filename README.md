# bingo

仿koa语法的deno版web框架

## Install

```
$ npm install --save-dev @douhao/px2rpx
```

## Hello Bingo

```js
const app = new Bingo();

// response
app.use(ctx => {
  ctx.body = 'Hello Bingo';
});

app.listen(3000);
```


