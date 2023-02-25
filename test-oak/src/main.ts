import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const router = new Router();
router
.get('/test1/:id', (context) => {
  console.log(`test1] param: ${JSON.stringify(context.params)}`);

  const queries = getQuery(context, { mergeParams: true });
  console.log(`test1] param: ${JSON.stringify(queries)}`);

  context.response.body = "test1 response";
})
.post('/test2', (context) => {
  console.log(`test2] body: ${JSON.stringify(context.request.body)}`);

  context.response.body = 'test2 response';
});

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');

  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;

  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
