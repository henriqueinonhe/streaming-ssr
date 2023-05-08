import { ControlPanel } from "./ControlPanel";

export const HostApp = () => {
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

      <div
        style={{
          display: "flex",
        }}
      >
        <iframe src="http://a.localhost:3000/app" />

        <ControlPanel />
      </div>
    </>
  );
};
