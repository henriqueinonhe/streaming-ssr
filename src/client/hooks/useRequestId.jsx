import { useContext } from "react";
import { RequestIdContext } from "../components/RequestIdProvider";

export const useRequestId = () => {
  const value = useContext(RequestIdContext);

  if (!value) {
    throw new Error("useRequestId must be used within a RequestIdProvider");
  }

  return value;
};
