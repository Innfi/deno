import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

// deno-lint-ignore ban-types
const objectList: object[] = [];

enum MetadataEnum {
  ClassData = "classInfo",
  MethodData = "methodInfo",
  ParamData = "paramData",
}

const ClassDeco = (path: string): ClassDecorator => {
  // deno-lint-ignore ban-types
  return (target: object) => {
    Reflect.defineMetadata(MetadataEnum.ClassData, path, target);
    objectList.push(target);
  };
}

interface MethodInfo {
  [key: string]: string;
}

const MethodDeco = (method: string, path: string): MethodDecorator => {
  // deno-lint-ignore no-explicit-any
  return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const currentMethodInfo: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, target) || {};
    currentMethodInfo[`${method}:${path}`] = propertyKey.toString();
    
    Reflect.defineMetadata(MetadataEnum.MethodData, currentMethodInfo, target);

    return descriptor;
  };
};

interface ParamInfo {
  [key: string]: {
    methodName: string,
    paramName: string;
    paramIndex: number,
  };
}

const ParamDeco = (name: string): ParameterDecorator => {
  // deno-lint-ignore no-explicit-any
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const current: ParamInfo = Reflect.getMetadata(MetadataEnum.ParamData, target) || {};

    console.log(`name: ${name}`);
    console.log(`propKey: ${propertyKey.toString()}, index: ${parameterIndex}`);

    current[`${propertyKey.toString()}:${name}:${parameterIndex}`] = {
      methodName: propertyKey.toString(),
      paramName: name,
      paramIndex: parameterIndex,
    };

    Reflect.defineMetadata(MetadataEnum.ParamData, current, target);
  };
};

@ClassDeco('example')
class Example {
  readonly className: string;
  userId?: number;
  userName?: string;
  email?: string;

  constructor(className: string) {
    console.log(`Example] constructor called`);
    this.className = className;
  }

  @MethodDeco('post', '/example')
  setData(
    @ParamDeco('userId') userId: number,
    @ParamDeco('userName') userName: string,
    @ParamDeco('email') email: string
  ) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
  }

  @MethodDeco('get', '/example')
  getData(
    @ParamDeco('userId') userId: number
  ): { userName: string; email: string; } | undefined {
    if (userId !== 1) return undefined;

    return {
      userName: this.userName!,
      email: this.email!,
    };
  }
}

const classMetadata = Reflect.getMetadata(MetadataEnum.ClassData, Example);
console.log(`metadata: ${classMetadata}`);

// deno-lint-ignore no-explicit-any
const instance: Example = new (objectList[0] as any)('testName');

const methodMetadata: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, instance);
Object.keys(methodMetadata).forEach((v: string) => {
  console.log(`key: ${v}, value: ${methodMetadata[v]}`);
});

const paramMetadata: ParamInfo = Reflect.getMetadata(MetadataEnum.ParamData, instance);
Object.keys(paramMetadata).forEach((v: string) => {
  console.log(`key: ${v}, value: ${JSON.stringify(paramMetadata[v])}`);
});


instance.setData(1, 'innfi', 'innfi@test.com');
console.log(instance.getData(1)!.userName);
