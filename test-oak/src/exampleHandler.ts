import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { ClassDeco,MethodDeco,ParamDeco,MetadataEnum,objectList,MethodInfo,ParamInfo } from "./decorators.ts";

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

// const router = new Router();

// deno-lint-ignore ban-types
objectList.forEach((injectorTarget: object) => {
  // deno-lint-ignore no-explicit-any
  const instance = new (injectorTarget as any)('');

  const methodMetadata: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, instance);
  Object.keys(methodMetadata).forEach((v: string) => {
    console.log(`methodMetadata] key: ${v}, value: ${methodMetadata[v]}`);
  });
  
  const paramMetadata: ParamInfo = Reflect.getMetadata(MetadataEnum.ParamData, instance);
  Object.keys(paramMetadata).forEach((v: string) => {
    console.log(`paramMetadata] key: ${v}, value: ${JSON.stringify(paramMetadata[v])}`);
  });
});
