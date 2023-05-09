import { Block } from "./components/Block";
import { Suspense } from "react";
import { Spinner } from "./components/Spinner";

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
            <Block id={"1"} />
          </Suspense>

          <Suspense fallback={<Spinner label="2" />}>
            <Block id={"2"} />
          </Suspense>

          <Suspense fallback={<Spinner label="3" />}>
            <Block id={"3"} />
          </Suspense>

          <Suspense fallback={<Spinner label="4" />}>
            <Block id={"4"} />
          </Suspense>

          <Suspense fallback={<Spinner label="5" />}>
            <Block id={"5"} />
          </Suspense>

          <Suspense fallback={<Spinner label="6" />}>
            <Block id={"6"} />
          </Suspense>
        </div>
      </body>
    </html>
  );
};
