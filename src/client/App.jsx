import { Spinner } from "./components/Spinner";
import { Suspense, lazy } from "react";
import { RequestIdProvider } from "./components/RequestIdProvider";
import { isServer } from "./utils";
import { sleep } from "./utils";

let serverWorkerData;
let writeSync;

if (isServer) {
  serverWorkerData = eval("require")("worker_threads").workerData;
  writeSync = eval("require")("fs").writeSync;
}

// Code Splitting
const First = lazy(() => import("./components/blocks/First"));
const Second = lazy(() => import("./components/blocks/Second"));
const Third = lazy(() => import("./components/blocks/Third"));
const Fourth = lazy(() => import("./components/blocks/Fourth"));
const Fifth = lazy(() => import("./components/blocks/Fifth"));
const Sixth = lazy(() => import("./components/blocks/Sixth"));

// Prefetching
import("./components/blocks/First");
import("./components/blocks/Second");
import("./components/blocks/Third");
import("./components/blocks/Fourth");
import("./components/blocks/Fifth");
import("./components/blocks/Sixth");

export const App = ({ data }) => {
  if (isServer) {
    // This is needed because both console.log
    // and stdout.write are NON blocking and here
    // we need a blocking behavior
    writeSync(1, `Rendering shell on server!\n`);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SSR React</title>
        {/* 
          We have to do load this script here, synchronously so that 
          it starts the worker thread before the React app starts,
          otherwise it gets blocked
        */}
        <script src="/client/initiateWorker.js" />

        <script src="/client/index.js" defer />
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
  writeSync(1, `Shell rendered on server!\n`);

  // Reset shell render blocking
  sharedRenderShellArray[0] = 0;

  return null;
};
