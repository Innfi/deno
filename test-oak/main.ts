import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
export { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

export function add(a: number, b: number): number {
  return a + b;
}


type Constructor<T = unknown> = new (...args: any[]) => T;

function Deco<T>(_: Constructor<T>): void {}

@Deco
class Initial {
  constructor(a: string, b: number) {

  }
}

console.log(`before reflect`);
const metadata = Reflect.getMetadata("design:paramtypes", Initial);
console.log(metadata);
console.log(`after reflect`);

const app = new Application();

app.use((ctx) => {
  ctx.response.body = 'hello, world';
});

await app.listen({ port: 3000 });