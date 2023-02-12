export const Param = (property: string): ParameterDecorator => {
  // Reflect.defineMetadata()

  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
    console.log(`target: ${JSON.stringify(target)}`);
    console.log(`target: ${JSON.stringify(propertyKey)}`);
    console.log(`target: ${JSON.stringify(parameterIndex)}`);
  };
};