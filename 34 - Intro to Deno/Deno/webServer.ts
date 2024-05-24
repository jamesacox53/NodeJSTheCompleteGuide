const port = 8080;

const handler = (request: Request): Response => {
  const body = "Hello World!";

  return new Response(body, { status: 200 });
};

console.log(`HTTP server running. Access it at: http://localhost:8080/`);
Deno.serve({ port }, handler);