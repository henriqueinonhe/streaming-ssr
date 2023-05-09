import express from "express";
import { Worker } from "node:worker_threads";
import { resolve } from "path";

const app = express();

const resolvers = {
  data: {},
  html: undefined,
};

const sharedRenderBuffer = new SharedArrayBuffer(6);
const sharedRenderArray = new Int8Array(sharedRenderBuffer);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SPA React</title>
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
  const fetchData = (id) =>
    fetch(`http://localhost:3000/data/${id}`).then((res) => {
      console.log(`Data ${id} fetched!`);
      return res.text();
    });

  const data = await Promise.all([
    fetchData(1),
    fetchData(2),
    fetchData(3),
    fetchData(4),
    fetchData(5),
    fetchData(6),
  ]);

  const worker = new Worker(resolve(__dirname, "./worker.js"), {
    workerData: {
      data,
      sharedRenderArray,
    },
  });

  worker.on("message", async (html) => {
    await new Promise((resolver) => {
      resolvers.html = resolver;
    });

    res.send(html);
  });
});

app.get("/data/:id", async (req, res) => {
  const { id } = req.params;

  await new Promise((resolver) => {
    resolvers.data[id] = resolver;
  });

  res.setHeader("Content-Type", "application/json");
  res.send("Ok");
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

app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("Server up!");
});
