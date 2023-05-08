export const ControlPanel = () => {
  return (
    <div>
      <Menu id="1" />
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
