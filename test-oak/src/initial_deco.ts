import { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

export function HandlerMethod(name: string): MethodDecorator {
  return function(
    // deno-lint-ignore ban-types
    _target: Object, 
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

export interface MethodMetadata {
  initializer: any;  
  key: string | symbol;
  name: string;
  index: number;
  [paramIndex: string]: any;
}

// TODO
export function HandlerParam(name: string): ParameterDecorator {
  // deno-lint-ignore ban-types
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    console.log(`HandlerParam] name: ${name}`);
    //console.log(`HandlerParam] target: ${target.}`);
    console.log(`HandlerParam] propertyKey: ${propertyKey.toString()}`);
    console.log(`HandlerParam] index: ${parameterIndex}`);

    const methodMetadata: MethodMetadata = {
      initializer: target,
      key: propertyKey,
      name,
      index: parameterIndex,
    };

    Reflect.defineMetadata('test_param', methodMetadata, target);
  }
}


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