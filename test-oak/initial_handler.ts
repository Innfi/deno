
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

  postUser(userData: UserData): MethodResult<UserData> {
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

  getUser(id: number): MethodResult<UserData> {
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