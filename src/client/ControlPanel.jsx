export const ControlPanel = () => {
  const sendHtml = () => {
    fetch("/remote-control/send-html");
  };

  const sendBundle = () => {
    fetch("/remote-control/bundle");
  };

  const finishDataFetching = () => {
    fetch("/remote-control/data/1");
    fetch("/remote-control/data/2");
    fetch("/remote-control/data/3");
    fetch("/remote-control/data/4");
    fetch("/remote-control/data/5");
    fetch("/remote-control/data/6");
  };

  const finishRendering = () => {
    fetch("/remote-control/render/1");
    fetch("/remote-control/render/2");
    fetch("/remote-control/render/3");
    fetch("/remote-control/render/4");
    fetch("/remote-control/render/5");
    fetch("/remote-control/render/6");
  };

  const buttonStyle = {
    width: 300,
    padding: 8,
    marginTop: 12,
  };

  const debug = false;

  return (
    <div
      style={{
        borderLeft: "1px solid black",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Remote Control
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Menu id="1" />
        <Menu id="2" />
        <Menu id="3" />
        <Menu id="4" />
        <Menu id="5" />
        <Menu id="6" />

        {debug && (
          <>
            <button style={buttonStyle} onClick={finishDataFetching}>
              Finish Data Fetching
            </button>

            <button style={buttonStyle} onClick={finishRendering}>
              Finish Rendering
            </button>
          </>
        )}

        <button style={buttonStyle} onClick={sendHtml}>
          Send HTML
        </button>

        <button style={buttonStyle} onClick={sendBundle}>
          Send Bundle
        </button>
      </div>
    </div>
  );
};

const Menu = ({ id }) => {
  const finishDataFetching = () => {
    fetch(`/remote-control/data/${id}`);
  };

  const finishRendering = () => {
    fetch(`/remote-control/render/${id}`);
  };

  const finishHydration = () => {
    fetch(`/remote-control/hydrate/${id}`);
  };

  const buttonStyle = {
    marginTop: 8,
    padding: 8,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 12,
      }}
    >
      <h2>{id}</h2>

      <button style={buttonStyle} onClick={finishDataFetching}>
        Finish Data Fetching
      </button>

      <button style={buttonStyle} onClick={finishRendering}>
        Finish Rendering
      </button>

      <button style={buttonStyle} onClick={finishHydration}>
        Finish Hydration
      </button>
    </div>
  );
};
