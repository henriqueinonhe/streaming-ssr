import { createContext, useRef } from "react";
import { isServer } from "../utils";

export const RequestIdContext = createContext(undefined);

export const RequestIdProvider = ({ children }) => {
  const requestIdRef = useRef(isServer ? Math.random() : window.__REQUEST_ID__);

  return (
    <RequestIdContext.Provider value={requestIdRef.current}>
      {children}

      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.__REQUEST_ID__ = ${requestIdRef.current};
        `,
        }}
      />
    </RequestIdContext.Provider>
  );
};
