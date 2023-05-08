import express from "express";
import { renderToString } from "react-dom/server";
import { App } from "../client/App";

const app = express();

const resolvers = {
  render: undefined,
  data: {},
};

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
    </head>
    <body>
      <div id="root"></div> 
    </body>
    </html>
  `);
});

app.get("/app", async (req, res) => {
  const response = await fetch("http://localhost:3000/data/1");
  const data = await response.text();

  await new Promise((resolver) => {
    resolvers.render = resolver;
  });

  res.send(renderToString(<App data={data} />));
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

app.get("/remote-control/render", (req, res) => {
  resolvers.render();

  res.send("Ok");
});

app.use(express.static("dist"));

app.listen(3000, () => {
  console.log("Server up!");
});
