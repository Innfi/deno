import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { Application, Router, RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";

import { ClassDeco,MethodDeco,ParamDeco,MetadataEnum,objectList,MethodInfo, BodyDeco, ArgumentUnit, ArgumentInfo } from "./decorators.ts";

export interface TestBody {
  userId: number;
  userName: string;
  email: string;
}

@ClassDeco('example')
export class Example {
  readonly className: string;
  userId?: number;
  userName?: string;
  email?: string;

  constructor(className: string) {
    console.log(`Example] constructor called`);
    this.className = className;
  }

  @MethodDeco('post', '/example')
  setData(@BodyDeco('input') input: TestBody) {
    console.log(`input: ${JSON.stringify(input)}`);
    const { userId, userName, email } = input;

    this.userId = userId;
    this.userName = userName;
    this.email = email;
  }

  @MethodDeco('get', '/example')
  getData(
    @ParamDeco('userId') userId: number,
    @ParamDeco('param1') param1: string,
    @ParamDeco('param2') param2: number,
  ): { userName: string; email: string; } | undefined {
    console.log(`getData] called: ${userId}, ${param1}, ${param2}`);

    return {
      userName: 'innfi',
      email: 'innfi@test.com',
    };
  }
}

const naiveRouter = (
  router: Router, 
  routerParam: string, 
  controllerMethod: string,
  argsUnits: ArgumentUnit[],
  // deno-lint-ignore no-explicit-any
  instance: any,
) => {
  const routerParams = routerParam.split(':');
  const method = routerParams[0];
  const path = routerParams[1];

  console.log(`method: ${method}, path: ${path}`);
  console.log(`argsUnits: ${JSON.stringify(argsUnits)}`);

  // deno-lint-ignore no-explicit-any
  (router as any)[method](path, async (context: any) => {
    const methodArgs = [];

    for(const argUnit of argsUnits) {
      const argData = await testParser(argUnit, context);
      methodArgs.push(argData);
    }

    methodArgs.sort((a, b) => a.index - b.index);
    const pureData = methodArgs.map((v) => v.argData);

    context.response.body = instance[controllerMethod](...pureData);
  });
};

// deno-lint-ignore no-explicit-any
const testParser = async (argUnit: ArgumentUnit, context: any): Promise<{ index: number; argData: any }> => {
  const { argType, argIndex, argName } = argUnit;

  switch (argType) {
    case 'query': {
      const queries = getQuery(context, { mergeParams: true });
      console.log(`argName: ${argName}, argData: ${queries[argName]}`);
      return {
        index: argIndex,
        argData: queries[argName],
      };
    }
    case 'param': {
      const queries = getQuery(context, { mergeParams: true});
      console.log(`argName: ${argName}, argData: ${queries[argName]}`);
      return {
        index: argIndex,
        argData: queries[argName],
      };
    }
    case 'body': {
      const body = await context.request.body().value;
      return {
        index: argIndex,
        argData: body,
      };
    }
    default: 
      throw new Error('undefined');
  }
};

const router = new Router();

// deno-lint-ignore ban-types
objectList.forEach((injectorTarget: object) => {
  // deno-lint-ignore no-explicit-any
  const instance = new (injectorTarget as any)('');

  const methodMetadata: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, instance);
  const argumentInfo: ArgumentInfo = Reflect.getMetadata(MetadataEnum.ArgumentData, instance);

  Object.keys(methodMetadata).forEach((v: string) => {
    const controllerMethod = methodMetadata[v];
    const argsUnits: ArgumentUnit[] = argumentInfo[controllerMethod];

    naiveRouter(router, v, controllerMethod, argsUnits, instance);
  });
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
