export function add(a: number, b: number): number {
  return a + b;
}

// // Learn more at https://deno.land/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }

import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = 'hello, world';
});

await app.listen({ port: 3000 });