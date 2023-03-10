import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";

import { ClassDeco,MethodDeco,ParamDeco,MetadataEnum,objectList,MethodInfo,ParamInfo, ParamUnit, BodyDeco } from "./decorators.ts";

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
  paramUnits: ParamUnit[],
  // deno-lint-ignore no-explicit-any
  instance: any,
) => {
  const routerParams = routerParam.split(':');
  const method = routerParams[0];
  const path = routerParams[1];

  if (method === 'get') {
    router[method](path, (context) => {
      // paramUnits.sort((a, b) => a.paramIndex - b.paramIndex);
      const parameters = paramUnits.map((v) => v.paramName);
      console.log(`params: ${JSON.stringify(parameters)}`);

      const queries = getQuery(context, { mergeParams: true });
      const methodArgs = parameters.map((v) => queries[v]);

      context.response.body = instance[controllerMethod](...methodArgs);
    });

    return;
  } 
  
  if (method === 'post') {
    router[method](path, async (context) => {
      const body = await context.request.body().value;

      context.response.body = instance[controllerMethod](body);
    })
  }
};


const router = new Router();

// deno-lint-ignore ban-types
objectList.forEach((injectorTarget: object) => {
  // deno-lint-ignore no-explicit-any
  const instance = new (injectorTarget as any)('');

  const methodMetadata: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, instance);
  const paramMetadata: ParamInfo = Reflect.getMetadata(MetadataEnum.ParamData, instance);

  Object.keys(methodMetadata).forEach((v: string) => {
    const controllerMethod = methodMetadata[v];
    const paramUnits: ParamUnit[] = paramMetadata[controllerMethod];

    naiveRouter(router, v, controllerMethod, paramUnits, instance);
  });
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 3000 });
