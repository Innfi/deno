export { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

export const Param = (property: string): ParameterDecorator => {
  // Reflect.defineMetadata()

  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
    console.log(`target: ${JSON.stringify(target)}`);
    console.log(`target: ${JSON.stringify(propertyKey)}`);
    console.log(`target: ${JSON.stringify(parameterIndex)}`);
  };
};

const requiredKey = Symbol("required");

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;
console.log(`propName: ${propertyName}`);
  descriptor.value = function () {
    let existingParams: number[] = Reflect.getOwnMetadata(requiredKey, target, propertyName);
    if (existingParams) { console.log(`params exists`) };
console.log(`arguments: ${JSON.stringify(arguments)}`);
    return method.apply(this, arguments);
  }
}

const ReqDeco = (name: string): ParameterDecorator => {
  return function required(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    console.log(`name: ${name}`);
    let existingParams: number[] = Reflect.getOwnMetadata(requiredKey, target, propertyKey) || [];

    existingParams.push(parameterIndex);
    console.log(`--- target: ${JSON.stringify(target)}`);

    Reflect.defineMetadata(requiredKey, existingParams, target, propertyKey);
  }
};

class DecoTester {
  @validate
  runner(
    @ReqDeco('input') input: number,
    @ReqDeco('tester') tester: string,
  ): string {
    if (input && tester) return `params: ${input}, ${tester}`;

    return `default return`;
  }
}

const instance = new DecoTester();

instance.runner(1234, 'string input');

const input = Number('not number');
instance.runner(input, undefined);