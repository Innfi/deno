// export function Controller(path: string): ClassDecorator {
  
//   // TODO
  
//   return function() {

//   }
// }

export function HandlerMethod(name: string): MethodDecorator {
  return function(
    target: Object, 
    propertyKey: string | symbol, 
    // deno-lint-ignore no-explicit-any
    descriptor: TypedPropertyDescriptor<any>) {

    const original = descriptor.value!;

    // deno-lint-ignore no-explicit-any
    descriptor.value = function(...args: any[]) {
      console.log(`name: ${name}, propKey: ${propertyKey.toString()}`);

      console.log(`args: ${args}`);
      return original.apply(this, args);
    }

    return descriptor;
  }
}

// TODO
// export function HandlerParam(): ParameterDecorator {}


// // deno-lint-ignore no-explicit-any
// type Constructor<T = unknown> = new (...args: any[]) => T;

// function Deco<T>(constructor: Constructor<T>): void {
//   const original = constructor.prototype;

//   // deno-lint-ignore no-explicit-any
//   constructor.prototype = function(...args: any[]) { //throw errors bc constructor is a readonly prop
//     console.log(`from class decorator`);

//     return original.apply(this, args);
//   }
// }