import { First } from "./components/blocks/First";
import { Second } from "./components/blocks/Second";
import { Third } from "./components/blocks/Third";
import { Fourth } from "./components/blocks/Fourth";
import { Fifth } from "./components/blocks/Fifth";
import { Sixth } from "./components/blocks/Sixth";

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
          <First />

          <Second />

          <Third />

          <Fourth />

          <Fifth />

          <Sixth />
        </div>
      </body>
    </html>
  );
};
