import { renderToPipeableStream } from "react-dom/server";
import { App } from "../client/App";
import { parentPort, workerData } from "node:worker_threads";

const run = async () => {
  const { data, sharedRenderArray } = workerData;

  const drainEventHandlers = [];
  const errorEventHandlers = [];
  const closeEventHandlers = [];
  let sendShellResolver;

  const writableStreamLike = {
    write: (chunk) => {
      parentPort.postMessage({ type: "write", data: chunk });
    },
    on: (event, handler) => {
      if (event === "drain") {
        drainEventHandlers.push(handler);
      } else if (event === "error") {
        errorEventHandlers.push(handler);
      } else if (event === "close") {
        closeEventHandlers.push(handler);
      }
    },
    end: () => parentPort.postMessage({ type: "end" }),
  };

  parentPort.on("message", (message) => {
    if (message.type === "drain") {
      drainEventHandlers.forEach((handler) => handler());
    } else if (message.type === "error") {
      errorEventHandlers.forEach((handler) => handler(message.data));
    } else if (message.type === "close") {
      closeEventHandlers.forEach((handler) => handler());
    } else if (message === "Send shell!") {
      sendShellResolver();
    }
  });

  const { pipe } = renderToPipeableStream(<App data={data} />, {
    bootstrapScripts: ["./client/index.js"],
    onShellReady: async () => {
      await new Promise((resolver) => {
        sendShellResolver = resolver;
      });

      pipe(writableStreamLike);
    },
  });

  // Reset render blocking
  sharedRenderArray[0] = 0;
  sharedRenderArray[1] = 0;
  sharedRenderArray[2] = 0;
  sharedRenderArray[3] = 0;
  sharedRenderArray[4] = 0;
  sharedRenderArray[5] = 0;
};

run();
