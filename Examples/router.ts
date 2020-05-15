/* Notes:
* In this example, we are using routing. Just like in express and Koa!
* This will let you have multiple routes so if you like to access a certain page, json etc. This is the way to go.
*/
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();


// Used for the example below.
const data = new Map<string, string>();
const names = ["Nate", "Ryan", "Rajat", "Jazz", "Neutronic"];

for (let i = 0; i < names.length; i++) {
  data.set((i + 1).toString(), names[i]);
}


//Example to Get a List of users (See the data bove being defined), by specific ID or to post a new user.
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


  //Example of a single Route. Very much like Express and Koa.
  router.get("/", (context) => {
    context.response.body = "Welcome to the Homepage!\nAccess certain areas with the following routes:\n\n/users\n/user/:id\nhtml";
  })


  //This supports HTML as well, but don't write all your HTML pages like this!
  router.get("/html", (context) => {
    context.response.body = `<html><body><h1>Hello, World!</h1><p>This shows that HTML does work and Template Literals: <code>${context.request.url}</code>`;
  })

  //This will set a header with the Time (in milliseconds) it takes for the page to load. In this case for hosting it locally, its 0ms.  Also, in the console, each time you visit a route, it will log in the console.
  app.use(async (context, next) => {
    const rt = context.response.headers.get("X-Response-Time");
    const start = Date.now();
    const ms = Date.now() - start;
    context.response.headers.set("X-Response-Time", `${ms}ms`);  
    await next();
    console.log(`${context.request.method} ${context.request.url.pathname}`);
  });



app.use(router.routes());
app.use(router.allowedMethods());


//Listening for Requests :D
const options = { hostname: "localhost", port: 4242 }; //You can use Port 3000, 8000, 8080 etc.
console.log(`Your App is now listening on Port: ${options.port} `)

await app.listen(options);