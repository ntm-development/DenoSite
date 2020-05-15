import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

const data = new Map<string, string>();
const names = ["Nate", "Ryan", "Rajat", "Jazz", "Neutronic"];

for (let i = 0; i < names.length; i++) {
  data.set((i + 1).toString(), names[i]);
}

router
  .get("/users", (context) => {
    context.response.body = Array.from(data);
  })
  .get("/user/:id", (context) => {
    let data_id = context.params.id!;
    context.response.body = { name: data.get(data_id) };
  })
  .post("/users", ({ request, response }) => {
    if (!request.hasBody) {
      response.status = 400;
      response.body = { status: "400 Bad Request", msg: "You need to specify" };
    } else {
      response.body = { status: "200 Success", data: request.body() };
    }
  });

  router.get("/", (context) => {
    context.response.body = "Welcome to the Homepage!";
  })

  // Obviously a better way to do this instead of putting html code in the body.
  router.get("/html", (context) => {
    context.response.body = `<html><body><h1>404 - Not Found</h1><p>Path <code>${context.request.url}</code> not found.`;
  })


  app.use(async (context, next) => {
    const rt = context.response.headers.get("X-Response-Time");
    const start = Date.now();
    const ms = Date.now() - start;
    context.response.headers.set("X-Response-Time", `${ms}ms`);  
    await next();
    console.log(`${context.request.method} ${context.request.url.pathname}`);
  });




//More Examples - These can't be used with routers
/*
//Example Body
app.use((ctx) => {
  ctx.response.body = "Hello Friend, This is a normal RAW Body Example"
});

//Example JSON
app.use((ctx) => {
  ctx.response.body = {
      message: 'Hello Friend, this is a JSON example!',
      help: 'If you need help, join our Discord https://dev.ntmnathan.com/discord'
  };
});*/


app.use(router.routes());
app.use(router.allowedMethods());

//Listening for Requests :D
const options = { hostname: "localhost", port: 4242 }; //You can use Port 3000, 8000, 8080 etc.
console.log(`Your App is now listening on Port: ${options.port} `)

await app.listen(options);
