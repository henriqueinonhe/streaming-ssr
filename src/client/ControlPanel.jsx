export const ControlPanel = () => {
  const finishRendering = () => {
    fetch("/remote-control/render");
  };

  return (
    <div>
      <Menu id="1" />
      <button onClick={finishRendering}>Finish Rendering</button>
    </div>
  );
};

const Menu = ({ id }) => {
  const finishDataFetching = () => {
    fetch(`/remote-control/data/${id}`);
  };

  return (
    <>
      <button onClick={finishDataFetching}>Finish Data Fetching</button>
    </>
  );
};
