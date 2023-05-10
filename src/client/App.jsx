import { First } from "./components/blocks/First";
import { Second } from "./components/blocks/Second";
import { Third } from "./components/blocks/Third";
import { Fourth } from "./components/blocks/Fourth";
import { Fifth } from "./components/blocks/Fifth";
import { Sixth } from "./components/blocks/Sixth";
import { Spinner } from "./components/Spinner";
import { Suspense } from "react";
import { RequestIdProvider } from "./components/RequestIdProvider";
import { isServer } from "./utils";
import { sleep } from "./utils";

let serverWorkerData;
let writeSync;

if (isServer) {
  serverWorkerData = require("worker_threads").workerData;
  writeSync = require("fs").writeSync;
}

export const App = ({ data }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SSR React</title>
        <script src="/client/index.js" defer />
        {/* 
          We have to do load this script here, synchronously so that 
          it starts the worker thread before the React app starts,
          otherwise it gets blocked
        */}
        <script src="/client/initiateWorker.js" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              position: relative;
            }
        `,
          }}
        />
      </head>
      <body>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <RequestIdProvider>
            <Suspense fallback={<Spinner label="1" />}>
              <First />
            </Suspense>

            <Suspense fallback={<Spinner label="2" />}>
              <Second />
            </Suspense>

            <Suspense fallback={<Spinner label="3" />}>
              <Third />
            </Suspense>

            <Suspense fallback={<Spinner label="4" />}>
              <Fourth />
            </Suspense>

            <Suspense fallback={<Spinner label="5" />}>
              <Fifth />
            </Suspense>

            <Suspense fallback={<Spinner label="6" />}>
              <Sixth />
            </Suspense>
          </RequestIdProvider>

          {isServer && <BlockServerRender />}
        </div>
      </body>
    </html>
  );
};

const BlockServerRender = () => {
  const { sharedRenderShellArray } = serverWorkerData;

  if (!sharedRenderShellArray[0]) {
    sleep(30);

    return <BlockServerRender />;
  }

  // This is needed because both console.log
  // and stdout.write are NON blocking and here
  // we need a blocking behavior
  writeSync(1, `Shell rendered!\n`);

  return null;
};
