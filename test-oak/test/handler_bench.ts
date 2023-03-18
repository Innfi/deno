Deno.bench('GET /example', () => {
	new URL('http://localhost:3000/example?userId=1&param1=ennfi&param2=123');
});
