import { Application } from "jsr:@oak/oak/application";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello World! (From Deno)";
});

await app.listen({ port: 8000 });