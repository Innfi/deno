import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
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

const app = new Application();

app.use((ctx) => {
  ctx.response.body = 'hello, world';
});

await app.listen({ port: 3000 });