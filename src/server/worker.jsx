import { renderToString, renderToPipeableStream } from "react-dom/server";
import { App } from "../client/App";
import { parentPort, workerData } from "node:worker_threads";

const { data, sharedRenderArray } = workerData;

const run = () => {
  const { pipe } = renderToPipeableStream(<App data={data} />, {
    bootstrapScripts: ["./client/index.js"],
    onShellReady: () => {},
  });

  const html = renderToString(<App data={data} />);

  // Reset render blocking
  sharedRenderArray[0] = 0;
  sharedRenderArray[1] = 0;
  sharedRenderArray[2] = 0;
  sharedRenderArray[3] = 0;
  sharedRenderArray[4] = 0;
  sharedRenderArray[5] = 0;

  return html;
};

parentPort.postMessage(run());
