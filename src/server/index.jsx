import express from "express";
import { Worker } from "node:worker_threads";
import { resolve } from "path";

const app = express();

const resolvers = {
  shellData: undefined,
  shell: undefined,
  data: {},
  bundle: {},
  initialBundle: undefined,
};

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
          overflow-x: hidden;
        }
      </style>
    </head>
    <body><div id="root"></div> 
    </body>
    </html>
  `);
});

const sharedRenderBuffer = new SharedArrayBuffer(6);
const sharedRenderArray = new Int8Array(sharedRenderBuffer);
const sharedRenderShellBuffer = new SharedArrayBuffer(1);
const sharedRenderShellArray = new Int8Array(sharedRenderShellBuffer);

app.get("/app", async (req, res) => {
  console.log("Fetching shell data!");

  const shellData = await fetch("http://localhost:3000/shell-data").then(
    (res) => {
      console.log("Shell data fetched!");
      return res.text();
    }
  );

  const worker = new Worker(resolve(__dirname, "./worker.js"), {
    workerData: {
      data: shellData,
      sharedRenderArray,
      sharedRenderShellArray,
    },
  });

  resolvers.shell = () => {
    worker.postMessage("Send shell!");
  };

  res.on("drain", () => {
    worker.postMessage({ type: "drain" });
  });

  res.on("error", (error) => {
    worker.postMessage({ type: "error", data: error });
  });

  res.on("close", () => {
    worker.postMessage({ type: "close" });
  });

  worker.on("message", (message) => {
    if (message.type === "write") {
      res.write(message.data);
    } else if (message.type === "end") {
      res.end();
    }
  });
});

app.get("/shell-data", async (req, res) => {
  await new Promise((resolver) => {
    resolvers.shellData = resolver;
  });

  res.send("Ok");
});

app.get("/data/:id", async (req, res) => {
  const { id } = req.params;

  console.log(`Fetching data for block ${id}!`);
  await new Promise((resolver) => {
    resolvers.data[id] = resolver;
  });
  console.log(`Data for block ${id} fetched!`);

  res.setHeader("Content-Type", "application/json");
  res.send("Ok");
});

app.get("/client/index.js", async (req, res) => {
  await new Promise((resolver) => {
    resolvers.initialBundle = resolver;
  });

  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(resolve(__dirname, "../../dist/client/index.js"));
});

app.get(
  "/client/src_client_components_blocks_First_jsx.js",
  async (req, res) => {
    await new Promise((resolver) => {
      resolvers.bundle["1"] = resolver;
    });

    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      resolve(
        __dirname,
        "../../dist/client/src_client_components_blocks_First_jsx.js"
      )
    );
  }
);

app.get(
  "/client/src_client_components_blocks_Second_jsx.js",
  async (req, res) => {
    await new Promise((resolver) => {
      resolvers.bundle["2"] = resolver;
    });

    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      resolve(
        __dirname,
        "../../dist/client/src_client_components_blocks_Second_jsx.js"
      )
    );
  }
);

app.get(
  "/client/src_client_components_blocks_Third_jsx.js",
  async (req, res) => {
    await new Promise((resolver) => {
      resolvers.bundle["3"] = resolver;
    });

    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      resolve(
        __dirname,
        "../../dist/client/src_client_components_blocks_Third_jsx.js"
      )
    );
  }
);

app.get(
  "/client/src_client_components_blocks_Fourth_jsx.js",
  async (req, res) => {
    await new Promise((resolver) => {
      resolvers.bundle["4"] = resolver;
    });

    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      resolve(
        __dirname,
        "../../dist/client/src_client_components_blocks_Fourth_jsx.js"
      )
    );
  }
);

app.get(
  "/client/src_client_components_blocks_Fifth_jsx.js",
  async (req, res) => {
    await new Promise((resolver) => {
      resolvers.bundle["5"] = resolver;
    });

    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      resolve(
        __dirname,
        "../../dist/client/src_client_components_blocks_Fifth_jsx.js"
      )
    );
  }
);

app.get(
  "/client/src_client_components_blocks_Sixth_jsx.js",
  async (req, res) => {
    await new Promise((resolver) => {
      resolvers.bundle["6"] = resolver;
    });

    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(
      resolve(
        __dirname,
        "../../dist/client/src_client_components_blocks_Sixth_jsx.js"
      )
    );
  }
);

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

app.get("/remote-control/shell-data", (req, res) => {
  resolvers.shellData();

  res.send("Ok");
});

app.get("/remote-control/shell-render", (req, res) => {
  sharedRenderShellArray[0] = 1;

  res.send("Ok");
});

app.get("/remote-control/send-shell", (req, res) => {
  resolvers.shell();

  res.send("Ok");
});

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

app.get("/remote-control/initialBundle", (req, res) => {
  resolvers.initialBundle();

  res.send("Ok");
});

app.get("/remote-control/bundle/:id", (req, res) => {
  const { id } = req.params;

  resolvers.bundle[id]();

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
