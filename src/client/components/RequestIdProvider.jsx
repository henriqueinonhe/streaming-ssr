import { createContext, useRef } from "react";

export const RequestIdContext = createContext(undefined);

export const RequestIdProvider = ({ children }) => {
  const requestIdRef = useRef(Math.random());

  return (
    <RequestIdContext.Provider value={requestIdRef.current}>
      {children}
    </RequestIdContext.Provider>
  );
};
