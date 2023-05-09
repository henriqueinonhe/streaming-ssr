import { isServer, sleep } from "./utils";

let workerData;
let writeSync;

if (isServer) {
  workerData = require("worker_threads").workerData;
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
        <script src="/client/index.js" defer></script>
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.__INITIAL_DATA__ = ${JSON.stringify(data)}
        `,
          }}
        />

        <Block id="1" />
        <Block id="2" />
        <Block id="3" />
        <Block id="4" />
        <Block id="5" />
        <Block id="6" />
      </body>
    </html>
  );
};

const Block = ({ id }) => {
  return (
    <>
      {isServer && <Stall id={id} />}
      <div
        style={{
          width: 100,
          height: 100,
          border: "2px solid black",
        }}
      />
    </>
  );
};

const Stall = ({ id }) => {
  const { sharedRenderArray } = workerData;
  const index = Number(id) - 1;

  if (!sharedRenderArray[index]) {
    sleep(30);

    return <Stall id={id} />;
  }

  // This is needed because both console.log
  // and stdout.write are NON blocking and here
  // we need a blocking behavior
  writeSync(1, `Block ${id} rendered!\n`);

  return null;
};
