import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";

import { ClassDeco,MethodDeco,ParamDeco,MetadataEnum,objectList,MethodInfo,ParamInfo, ParamUnit } from "./decorators.ts";

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

const naiveRouter = (
  router: Router, 
  routerParam: string, 
  controllerMethod: string,
  paramUnits: ParamUnit[],
  instance: any,
) => {
  const routerParams = routerParam.split(':');
  const method = routerParams[0];
  const path = routerParams[1];
  console.log(`methodMetadata] method: ${method}, path: ${path}`);

  console.log(`controllerMethod: ${controllerMethod}`);  

  paramUnits.sort((a, b) => a.paramIndex - b.paramIndex);
  const parameters = paramUnits.map((v) => v.paramName);

  console.log(`paramInfo: ${JSON.stringify(parameters)}`);

  if (method === 'get') {
    router.get(path, (context) => {
      const queries = getQuery(context, { mergeParams: true });
    });
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
