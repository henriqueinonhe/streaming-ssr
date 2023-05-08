import { createRoot } from "react-dom/client";
import { HostApp } from "./HostApp";

const rootNode = document.querySelector("#root");

createRoot(rootNode).render(<HostApp />);
