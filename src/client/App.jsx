export const App = () => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          position: relative;
      `,
        }}
      />
      Hello World!
    </>
  );
};
