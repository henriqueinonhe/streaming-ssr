import { Suspense, lazy } from "react";
import { Spinner } from "./components/Spinner";
import { isServer } from "./utils";

import("./components/blocks/First");
import("./components/blocks/Second");
import("./components/blocks/Third");
import("./components/blocks/Fourth");
import("./components/blocks/Fifth");
import("./components/blocks/Sixth");

const First = isServer
  ? require("./components/blocks/First").default
  : lazy(() => import("./components/blocks/First"));
const Second = isServer
  ? require("./components/blocks/Second").default
  : lazy(() => import("./components/blocks/Second"));
const Third = isServer
  ? require("./components/blocks/Third").default
  : lazy(() => import("./components/blocks/Third"));
const Fourth = isServer
  ? require("./components/blocks/Fourth").default
  : lazy(() => import("./components/blocks/Fourth"));
const Fifth = isServer
  ? require("./components/blocks/Fifth").default
  : lazy(() => import("./components/blocks/Fifth"));
const Sixth = isServer
  ? require("./components/blocks/Sixth").default
  : lazy(() => import("./components/blocks/Sixth"));

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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
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
        </div>
      </body>
    </html>
  );
};
