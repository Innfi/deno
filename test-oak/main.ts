import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
export { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

export function add(a: number, b: number): number {
  return a + b;
}


// deno-lint-ignore no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

function Deco<T>(_: Constructor<T>): void {}

function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  console.log(Reflect.getMetadata("design:type", target, propertyKey));
  console.log(Reflect.getMetadata("design:paramtypes", target, propertyKey)[0]);
  console.log(Reflect.getMetadata("design:paramtypes", target, propertyKey)[1]);
  console.log(Reflect.getMetadata("design:returntype", target, propertyKey));
}

@Deco
class Initial {
  constructor(a: string, b: number) {

  }

  @LogMethod
  public testDeco(input1: number, input2: string): string {
    return 'testDeco called';
  }
}


console.log(Reflect.getMetadata("design:type", Initial));
console.log(Reflect.getMetadata("design:paramtypes", Initial));
console.log(Reflect.getMetadata("design:returntype", Initial));


const app = new Application();

app.use((ctx) => {
  ctx.response.body = 'hello, world';
});

await app.listen({ port: 3000 });