import { useEffect, useState } from "react";
import { isClient, isServer, sleep } from "../utils";
import { Base } from "./Base";
import { useData } from "../hooks/useData";

let serverWorkerData;
let writeSync;

if (isServer) {
  serverWorkerData = eval("require")("worker_threads").workerData;
  writeSync = eval("require")("fs").writeSync;
}

export const Block = ({ id }) => {
  const { clientSideCache } = useData(id);

  const [state, setState] = useState("Html");
  const [clicking, setClicking] = useState(false);

  if (isClient && state !== "Ready") {
    const element = document.querySelector(`#base-${id}`);

    if (!element) return;

    element.style.border = "3px solid #4CFFCC";
    element.children[0].textContent = "Hydrating";
  }

  useEffect(() => {
    setState("Ready");
  }, []);

  const borderMatrix = {
    Html: "3px solid black",
    Ready: "3px solid #5281FF",
  };

  return (
    <>
      {isServer && <BlockServerRender id={id} />}

      {state === "Html" && isClient && <BlockHydration id={id} />}

      <Base
        id={"base-" + id}
        border={borderMatrix[state]}
        backgroundColor={clicking ? "#5281FF" : "#fff"}
        onMouseDown={() => setClicking(true)}
        onMouseUp={() => setClicking(false)}
        label={id}
      >
        {state}
      </Base>

      {clientSideCache}
    </>
  );
};

const BlockServerRender = ({ id }) => {
  const { sharedRenderArray } = serverWorkerData;
  const index = Number(id) - 1;

  if (!sharedRenderArray[index]) {
    sleep(30);

    return <BlockServerRender id={id} />;
  }

  // This is needed because both console.log
  // and stdout.write are NON blocking and here
  // we need a blocking behavior
  writeSync(1, `Block ${id} rendered!\n`);

  return null;
};

const BlockHydration = ({ id }) => {
  const index = Number(id) - 1;

  if (!window.clientSharedArray[index]) {
    sleep(30);

    return <BlockHydration id={id} />;
  }

  console.log(`Block ${index + 1} hydrated!`);

  return null;
};
