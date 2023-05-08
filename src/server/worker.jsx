import { renderToString } from "react-dom/server";
import { App } from "../client/App";
import { parentPort, workerData } from "node:worker_threads";

const data = workerData;

parentPort.postMessage(renderToString(<App data={data} />));
