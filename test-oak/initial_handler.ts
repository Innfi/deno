import { Reflect } from 'https://deno.land/x/deno_reflect@v0.2.1/mod.ts';

import { HandlerMethod, HandlerParam, MethodMetadata } from "./initial_deco.ts";

export interface UserData {
  id?: number;
  name: string;
  email: string;
  created: Date;
}

export interface MethodResult<T> {
  message: string;
  result?: T,
}

export class InitialHandler {
  idIndex: number;

  constructor() {
    this.idIndex = 0;
  }

  @HandlerMethod('/user/post')
  postUser(@HandlerParam('userData')  userData: UserData): MethodResult<UserData> {
    if (!userData) {
      return {
        message: 'invalid userData',
      }
    }

    // TODO: create user
    return {
      message: 'success',
      result: {
        ...userData,
        id: this.idIndex++,
      }
    }
  }

  @HandlerMethod('/user/get')
  getUser(@HandlerParam('id') id: number): MethodResult<UserData> {
    return {
      message: 'success',
      result: {
        id,
        name: 'dummy name',
        email: 'dummy@test.com',
        created: new Date(),
      },
    };
  }
}

const instance = new InitialHandler();

const result: MethodMetadata = Reflect.getMetadata('test_param', instance);

const result1 = instance.getUser(2);
const getUserResult = instance['getUser'](2);

// gets error but accepted... why?
// const result3 = instance[result.key](2);

 // deno-lint-ignore no-explicit-any
const result3 = (instance as any)[result.key](2);

console.log(`result 1: ${JSON.stringify(result1)}`);
console.log(`result 2: ${JSON.stringify(getUserResult)}`);
console.log(`result 3: ${JSON.stringify(result3)}`);