import { Reflect } from 'https://deno.land/x/reflect_metadata@v0.1.12/mod.ts';

// deno-lint-ignore ban-types
export const objectList: object[] = [];

export enum MetadataEnum {
	ClassData = 'classInfo',
	MethodData = 'methodInfo',
	ArgumentData = 'argData',
	BodyData = 'bodyData',
}

export interface MethodInfo {
	[key: string]: string;
}

export type ParamType = 'param' | 'body' | 'query';

export interface ArgumentUnit {
	methodName: string;
	argName: string;
	argIndex: number;
	argType: ParamType;
}

export interface ArgumentInfo {
	[key: string]: [ArgumentUnit];
}

export const ClassDeco = (path: string): ClassDecorator => {
	// deno-lint-ignore ban-types
	return (target: object) => {
		Reflect.defineMetadata(MetadataEnum.ClassData, path, target);
		objectList.push(target);
	};
};

export const MethodDeco = (method: string, path: string): MethodDecorator => {
	// deno-lint-ignore no-explicit-any
	return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
		const currentMethodInfo: MethodInfo = Reflect.getMetadata(MetadataEnum.MethodData, target) ||
			{};
		currentMethodInfo[`${method}:${path}`] = propertyKey.toString();

		Reflect.defineMetadata(MetadataEnum.MethodData, currentMethodInfo, target);

		return descriptor;
	};
};

export const argumentDeco = (name: string, paramType: ParamType): ParameterDecorator => {
	// deno-lint-ignore no-explicit-any
	return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
		const current: ArgumentInfo = Reflect.getMetadata(MetadataEnum.ArgumentData, target) || {};
		const key = propertyKey.toString();
		if (!current[key]) {
			current[key] = [{
				methodName: key,
				argName: name,
				argIndex: parameterIndex,
				argType: paramType,
			}];

			Reflect.defineMetadata(MetadataEnum.ArgumentData, current, target);
			return;
		}

		current[key].push({
			methodName: key,
			argName: name,
			argIndex: parameterIndex,
			argType: paramType,
		});

		Reflect.defineMetadata(MetadataEnum.ArgumentData, current, target);
	};
};

export const ParamDeco = (name: string): ParameterDecorator => {
	return argumentDeco(name, 'param');
};

export const BodyDeco = (name: string): ParameterDecorator => {
	return argumentDeco(name, 'body');
};
