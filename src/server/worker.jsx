import { renderToPipeableStream } from "react-dom/server";
import { App } from "../client/App";
import { parentPort, workerData } from "node:worker_threads";

const run = async () => {
  const { data, sharedRenderArray, sharedRenderShellArray } = workerData;

  const writableStreamLike = {
    write: (chunk) => {
      parentPort.postMessage(chunk);
    },
    on: () => {},
  };

  const { pipe } = renderToPipeableStream(<App data={data} />, {
    bootstrapScripts: ["./client/index.js"],
    onShellReady: async () => {
      // await new Promise((resolver) => {
      //   resolvers.shell = resolver;
      // });

      pipe(writableStreamLike);
      // Reset shell render blocking
      sharedRenderShellArray[0] = 0;
    },
  });

  // Reset render blocking
  // sharedRenderArray[0] = 0;
  // sharedRenderArray[1] = 0;
  // sharedRenderArray[2] = 0;
  // sharedRenderArray[3] = 0;
  // sharedRenderArray[4] = 0;
  // sharedRenderArray[5] = 0;
};

run();
