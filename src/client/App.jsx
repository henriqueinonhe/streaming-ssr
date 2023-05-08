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

        <Block />
        <Block />
        <Block />
        <Block />
        <Block />
        <Block />
      </body>
    </html>
  );
};

const Block = () => {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        border: "2px solid black",
      }}
    />
  );
};
