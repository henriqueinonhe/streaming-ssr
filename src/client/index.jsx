import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootNode = document.querySelector("#root");

createRoot(rootNode).render(<App />);
