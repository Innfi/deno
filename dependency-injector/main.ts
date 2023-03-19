import { Bootstrapped, bootstrap, Injectable } from "https://deno.land/x/inject@v0.1.2/mod.ts";

@Injectable()
export class InnerClass {
	hello() {
		return 'from inner class';
	}
}

@Injectable()
export class OuterClass {
	constructor(private readonly inner: InnerClass) {}

	callInner() {
		return this.inner.hello();
	}
}

@Bootstrapped()
class InitClass {
	constructor(private readonly outer: OuterClass) {}

	callOuter() {
		return this.outer.callInner();
	}
}

const instance = bootstrap(InitClass);

console.log(instance.callOuter());
