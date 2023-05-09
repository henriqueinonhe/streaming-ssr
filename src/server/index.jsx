import express from "express";
import { Worker } from "node:worker_threads";
import { resolve } from "path";
import { App } from "../client/App";
import { renderToPipeableStream } from "react-dom/server";

const app = express();

const resolvers = {
  data: {},
  html: undefined,
  bundle: undefined,
};

const sharedRenderBuffer = new SharedArrayBuffer(6);
const sharedRenderArray = new Int8Array(sharedRenderBuffer);

const setArrayBufferCompatibilityHeaders = (res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
};

app.use((req, res, next) => {
  setArrayBufferCompatibilityHeaders(res);
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Streaming SSR</title>
      <script src="/client/host.js" defer></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          position: relative;
        }

        html, body {
          height: 100%;
        }

        #root {
          height: 100%;
          overflow: hidden;
        }
      </style>
    </head>
    <body><div id="root"></div> 
    </body>
    </html>
  `);
});

app.get("/app", async (req, res) => {
  // const worker = new Worker(resolve(__dirname, "./worker.js"), {
  //   workerData: {
  //     data,
  //     sharedRenderArray,
  //   },
  // });

  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ["./client/index.js"],
    onShellReady: () => {
      pipe(res);
    },
  });

  // worker.on("message", async (html) => {
  //   await new Promise((resolver) => {
  //     resolvers.html = resolver;
  //   });

  //   res.send(html);
  // });
});

app.get("/data/:id", async (req, res) => {
  const { id } = req.params;

  await new Promise((resolver) => {
    resolvers.data[id] = resolver;
  });

  res.setHeader("Content-Type", "application/json");
  res.send("Ok");
});

app.get("/client/index.js", async (req, res) => {
  await new Promise((resolver) => {
    resolvers.bundle = resolver;
  });

  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(resolve(__dirname, "../../dist/client/index.js"));
});

const sseConnections = [];

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const connection = {
    send: (id) => res.write(`event: message\ndata: ${id}\n\n`),
    close: () => res.end(),
  };

  req.on("close", () => {
    const index = sseConnections.indexOf(connection);
    sseConnections.splice(index, 1);
    connection.close();
  });

  sseConnections.push(connection);
});

// Remote Control

app.get("/remote-control/data/:id", (req, res) => {
  const { id } = req.params;

  resolvers.data[id]();

  res.send("Ok");
});

app.get("/remote-control/render/:id", (req, res) => {
  const { id } = req.params;

  const index = Number(id) - 1;
  sharedRenderArray[index] = 1;

  res.send("Ok");
});

app.get("/remote-control/send-html", (req, res) => {
  resolvers.html();

  res.send("Ok");
});

app.get("/remote-control/bundle", (req, res) => {
  resolvers.bundle();

  res.send("Ok");
});

app.get("/remote-control/hydrate/:id", (req, res) => {
  const { id } = req.params;

  sseConnections.forEach((connection) => connection.send(id));

  res.send("Ok");
});

app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("Server up!");
});
