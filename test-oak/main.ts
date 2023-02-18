import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
export { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

export function add(a: number, b: number): number {
  return a + b;
}


// deno-lint-ignore no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

function Deco<T>(_: Constructor<T>): void {}

// deno-lint-ignore no-explicit-any
function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  // deno-lint-ignore no-explicit-any
  descriptor.value = function(...args: any[]) {
    console.log(`propertyKey: ${propertyKey.toString()}`);

    return original.apply(target, args);
  }
}

@Deco
class Initial {
  constructor() {}

  @LogMethod
  public testDeco(input1: number, input2: string): string {
    return `testDeco called: ${input1}, ${input2}`;
  }
}

const instance = new Initial();
instance.testDeco(1, 'second');



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