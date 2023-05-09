export const ControlPanel = () => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Menu id="1" />
      <Menu id="2" />
      <Menu id="3" />
      <Menu id="4" />
      <Menu id="5" />
      <Menu id="6" />
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

  return (
    <>
      <h2>{id}</h2>
      <button onClick={finishDataFetching}>Finish Data Fetching</button>
      <button onClick={finishRendering}>Finish Rendering</button>
    </>
  );
};
