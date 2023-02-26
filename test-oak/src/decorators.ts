import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

// deno-lint-ignore ban-types
export const objectList: object[] = [];

export enum MetadataEnum {
  ClassData = "classInfo",
  MethodData = "methodInfo",
  ParamData = "paramData",
}

export interface MethodInfo {
  [key: string]: string;
}

export interface ParamInfo {
  [key: string]: [{
    methodName: string,
    paramName: string;
    paramIndex: number,
  }];
}


export const ClassDeco = (path: string): ClassDecorator => {
  // deno-lint-ignore ban-types
  return (target: object) => {
    Reflect.defineMetadata(MetadataEnum.ClassData, path, target);
    objectList.push(target);
  };
}

export const MethodDeco = (method: string, path: string): MethodDecorator => {
  // deno-lint-ignore no-explicit-any
  return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const currentMethodInfo: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, target) || {};
    currentMethodInfo[`${method}:${path}`] = propertyKey.toString();
    
    Reflect.defineMetadata(MetadataEnum.MethodData, currentMethodInfo, target);

    return descriptor;
  };
};

export const ParamDeco = (name: string): ParameterDecorator => {
  // deno-lint-ignore no-explicit-any
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const current: ParamInfo = Reflect.getMetadata(MetadataEnum.ParamData, target) || {};

    const key = propertyKey.toString();
    if (!current[key]) {
      current[key] = [{
        methodName: propertyKey.toString(),
        paramName: name,
        paramIndex: parameterIndex,
      }];

      Reflect.defineMetadata(MetadataEnum.ParamData, current, target);
      return;
    }

    current[key].push({
      methodName: propertyKey.toString(),
      paramName: name,
      paramIndex: parameterIndex,
    });

    Reflect.defineMetadata(MetadataEnum.ParamData, current, target);
  };
};

