/* Notes:
* If you are using this in a Router file, these won't work for you
* Using both examples will not work. Test one by commenting out one and leaving one example.
*/
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

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
  });


//This will set a header with the Time (in milliseconds) it takes for the page to load. In this case for hosting it locally, its 0ms.  Also, in the console, each time you visit a route, it will log in the console.
app.use(async (context, next) => {
    const rt = context.response.headers.get("X-Response-Time");
        const start = Date.now();
        const ms = Date.now() - start;
    context.response.headers.set("X-Response-Time", `${ms}ms`);  
    await next();
    console.log(`${context.request.method} ${context.request.url.pathname}`);
});


//Listening for Requests :D
const options = { hostname: "localhost", port: 4242 }; //You can use Port 3000, 8000, 8080 etc.
console.log(`Your App is now listening on Port: ${options.port} `)

await app.listen(options);