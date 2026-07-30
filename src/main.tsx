import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { Toaster } from "react-hot-toast";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </>
);