import { assertEquals } from 'https://deno.land/std@0.174.0/testing/asserts.ts';

export function add(a: number, b: number): number {
	return a + b;
}

Deno.test(function addTest() {
	assertEquals(add(2, 3), 5);
});
