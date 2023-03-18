import { assertEquals } from 'https://deno.land/std@0.174.0/testing/asserts.ts';

class TargetClass {
	publicFirst(): number {
		return 1;
	}

	publicSecond(): string {
		return 'second';
	}

	publicThird(): { name: string; email: string } {
		return {
			name: 'ennfi',
			email: 'email@test.com',
		};
	}
}

Deno.test(function methodNameTest() {
	const methodName = 'publicFirst';

	const instance = new TargetClass();
	const result: number = instance[methodName]();

	assertEquals(result, 1);
});

Deno.test(function retrieveMethodNames() {
	const instance = new TargetClass();

	const names = Object.getOwnPropertyNames(instance) as Array<keyof TargetClass>;

	assertEquals(names.length > 0, true);
});
