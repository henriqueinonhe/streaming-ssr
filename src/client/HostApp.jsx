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
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "70%",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <iframe
            style={{
              border: "none",
              width: "100%",
              height: "100%",
            }}
            src="http://a.localhost:3000/app"
            // Needed to have access to SharedArrayBuffer
            allow="cross-origin-isolated"
          />
        </div>

        <ControlPanel />
      </div>
    </>
  );
};
